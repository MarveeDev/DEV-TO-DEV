import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ScoreService } from '../score/score.service';
import { CloudinaryService } from '../media/cloudinary.service';
import { MediaType } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService, 
    private scoreService: ScoreService,
    private cloudinaryService: CloudinaryService
  ) {}

  async createPost(userId: string, data: any) {
    if (!data.title || data.title.trim().length === 0) {
      throw new BadRequestException('Post title cannot be empty');
    }
    if (!data.content || data.content.trim().length === 0) {
      throw new BadRequestException('Post content cannot be empty');
    }
    if (!data.skills || data.skills.length === 0) {
      throw new BadRequestException('At least one skill is required');
    }

    const post = await this.prisma.post.create({
      data: {
        title: data.title.trim(),
        content: data.content.trim(),
        authorId: userId,
      },
      include: {
        author: {
          include: {
            developerProfile: true,
          },
        }
      },
    });

    if (data.skills && data.skills.length > 0) {
      for (const skillName of data.skills) {
        const nameStr = String(skillName).trim();
        if (!nameStr) continue;
        
        let skill = await this.prisma.skill.findFirst({
          where: { name: { equals: nameStr, mode: 'insensitive' } }
        });
        
        if (!skill) {
          skill = await this.prisma.skill.create({
            data: {
              name: nameStr,
              slug: nameStr.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            }
          });
        }
        
        await this.prisma.postSkill.create({
          data: {
            postId: post.id,
            skillId: skill.id
          }
        });
      }
    }

    if (data.mediaIds && Array.isArray(data.mediaIds) && data.mediaIds.length > 0) {
      const attachments = await this.prisma.mediaAttachment.findMany({
        where: { id: { in: data.mediaIds } }
      });
      for (const attachment of attachments) {
        if (attachment.uploaderId === userId && !attachment.postId) {
          await this.prisma.mediaAttachment.update({
            where: { id: attachment.id },
            data: { postId: post.id }
          });
        }
      }
    }

    const completePost = await this.prisma.post.findUnique({
      where: { id: post.id },
      include: {
        author: { include: { developerProfile: true } },
        skills: { include: { skill: true } },
        attachments: true
      }
    });

    this.scoreService.recordPostActivity(userId).catch(e => console.error(e));

    return completePost;
  }

  async getPosts(query: { username?: string; page?: number; limit?: number }, viewerId?: string) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (query.username) {
      where.author = {
        developerProfile: {
          username: query.username,
        },
      };
    }

    const [total, posts] = await Promise.all([
      this.prisma.post.count({ where }),
      this.prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            include: {
              developerProfile: true,
            },
          },
          skills: {
            include: { skill: true }
          },
          attachments: true,
          _count: { select: { likes: true } },
        },
      }),
    ]);

    const likedPostIds = new Set<string>();
    if (viewerId && posts.length > 0) {
      const likes = await this.prisma.postLike.findMany({
        where: { userId: viewerId, postId: { in: posts.map(p => p.id) } },
        select: { postId: true },
      });
      likes.forEach(l => likedPostIds.add(l.postId));
    }

    const sanitizedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      skills: post.skills.map(s => s.skill),
      attachments: post.attachments,
      likeCount: post._count.likes,
      likedByMe: likedPostIds.has(post.id),
      author: {
        id: post.authorId,
        profile: post.author.developerProfile,
      },
    }));

    return {
      data: sanitizedPosts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPostById(id: string, viewerId?: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          include: {
            developerProfile: true,
          },
        },
        skills: {
          include: { skill: true }
        },
        attachments: true,
        _count: { select: { likes: true } },
      }
    });

    if (!post) throw new NotFoundException('Post not found');

    let likedByMe = false;
    if (viewerId) {
      const like = await this.prisma.postLike.findUnique({
        where: { postId_userId: { postId: id, userId: viewerId } },
      });
      likedByMe = !!like;
    }

    const { _count, ...postData } = post;

    return {
      ...postData,
      skills: post.skills.map(s => s.skill),
      likeCount: _count.likes,
      likedByMe,
      author: {
        id: post.authorId,
        profile: post.author.developerProfile,
      }
    };
  }

  async getComments(postId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    const comments = await this.prisma.postComment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
      include: {
        author: {
          include: { developerProfile: true },
        },
      },
    });

    return comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      author: {
        id: comment.authorId,
        profile: comment.author.developerProfile,
      },
    }));
  }

  async createComment(userId: string, postId: string, content: string) {
    if (!content || content.trim().length === 0) {
      throw new BadRequestException('Comment cannot be empty');
    }

    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    const comment = await this.prisma.postComment.create({
      data: {
        postId,
        authorId: userId,
        content: content.trim(),
      },
      include: {
        author: {
          include: { developerProfile: true },
        },
      },
    });

    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      author: {
        id: comment.authorId,
        profile: comment.author.developerProfile,
      },
    };
  }

  async likePost(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    const existing = await this.prisma.postLike.findUnique({
      where: { postId_userId: { postId, userId } },
    });

    if (!existing) {
      await this.prisma.postLike.create({
        data: { postId, userId },
      });
    }

    const likeCount = await this.prisma.postLike.count({ where: { postId } });
    return { liked: true, likeCount };
  }

  async unlikePost(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    await this.prisma.postLike.deleteMany({ where: { postId, userId } });

    const likeCount = await this.prisma.postLike.count({ where: { postId } });
    return { liked: false, likeCount };
  }

  async updatePost(userId: string, id: string, data: any) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');
    if (post.authorId !== userId) throw new ForbiddenException('You are not the author of this post');

    if (data.skills) {
      if (data.skills.length === 0) {
        throw new BadRequestException('At least one skill is required');
      }
      await this.prisma.postSkill.deleteMany({ where: { postId: id } });
      
      for (const skillName of data.skills) {
        const nameStr = String(skillName).trim();
        if (!nameStr) continue;
        
        let skill = await this.prisma.skill.findFirst({
          where: { name: { equals: nameStr, mode: 'insensitive' } }
        });
        
        if (!skill) {
          skill = await this.prisma.skill.create({
            data: {
              name: nameStr,
              slug: nameStr.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            }
          });
        }
        
        await this.prisma.postSkill.create({
          data: {
            postId: id,
            skillId: skill.id
          }
        });
      }
    }

    return this.prisma.post.update({
      where: { id },
      data: {
        title: data.title ? data.title.trim() : undefined,
        content: data.content ? data.content.trim() : undefined,
      },
      include: {
        author: {
          include: { developerProfile: true }
        },
        skills: {
          include: { skill: true }
        },
        attachments: true
      }
    });
  }

  async deletePost(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: { attachments: true }
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    for (const attachment of post.attachments) {
      try {
        await this.cloudinaryService.deleteFile(
          attachment.publicId, 
          attachment.type === MediaType.VIDEO ? 'video' : 'image'
        );
      } catch (e) {
        console.error('Failed to delete Cloudinary asset', e);
      }
    }

    return this.prisma.post.delete({
      where: { id: postId },
    });
  }
}
