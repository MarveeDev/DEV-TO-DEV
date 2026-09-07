import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  // Store the two user ids in a canonical (sorted) order so a pair maps to a
  // single conversation regardless of who initiates it.
  private orderPair(a: string, b: string): [string, string] {
    return a < b ? [a, b] : [b, a];
  }

  private partnerOf(conversation: any, userId: string) {
    const partner = conversation.userAId === userId ? conversation.userB : conversation.userA;
    return { id: partner.id, profile: partner.developerProfile };
  }

  private assertParticipant(conversation: any, userId: string) {
    if (conversation.userAId !== userId && conversation.userBId !== userId) {
      throw new ForbiddenException('You are not part of this conversation');
    }
  }

  async getOrCreateConversationWithUsername(userId: string, username: string) {
    const targetProfile = await this.prisma.developerProfile.findUnique({
      where: { username },
      include: { user: true },
    });
    if (!targetProfile) throw new NotFoundException('Developer not found');

    const otherId = targetProfile.userId;
    if (otherId === userId) throw new BadRequestException('You cannot message yourself');

    const [userAId, userBId] = this.orderPair(userId, otherId);

    const conversation = await this.prisma.conversation.upsert({
      where: { userAId_userBId: { userAId, userBId } },
      update: {},
      create: { userAId, userBId },
      include: {
        userA: { include: { developerProfile: true } },
        userB: { include: { developerProfile: true } },
      },
    });

    return conversation;
  }

  async getConversations(userId: string) {
    const conversations = await this.prisma.conversation.findMany({
      where: { OR: [{ userAId: userId }, { userBId: userId }] },
      include: {
        userA: { include: { developerProfile: true } },
        userB: { include: { developerProfile: true } },
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return Promise.all(
      conversations.map(async (c) => {
        const unreadCount = await this.prisma.message.count({
          where: { conversationId: c.id, senderId: { not: userId }, read: false },
        });
        return {
          id: c.id,
          partner: this.partnerOf(c, userId),
          lastMessage: c.messages[0] ?? null,
          unreadCount,
          updatedAt: c.updatedAt,
        };
      }),
    );
  }

  private async loadConversationOrThrow(conversationId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        userA: { include: { developerProfile: true } },
        userB: { include: { developerProfile: true } },
      },
    });
    if (!conversation) throw new NotFoundException('Conversation not found');
    return conversation;
  }

  // Returns the conversation, its messages, and marks messages from the other
  // participant as read for the requesting user.
  async getConversationThread(userId: string, conversationId: string) {
    const conversation = await this.loadConversationOrThrow(conversationId);
    this.assertParticipant(conversation, userId);

    await this.prisma.message.updateMany({
      where: { conversationId, senderId: { not: userId }, read: false },
      data: { read: true },
    });

    const messages = await this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });

    return {
      id: conversation.id,
      partner: this.partnerOf(conversation, userId),
      messages,
    };
  }

  async sendMessage(userId: string, conversationId: string, body: string) {
    const text = (body ?? '').trim();
    if (!text) throw new BadRequestException('Message cannot be empty');
    if (text.length > 5000) throw new BadRequestException('Message is too long');

    const conversation = await this.loadConversationOrThrow(conversationId);
    this.assertParticipant(conversation, userId);

    const message = await this.prisma.message.create({
      data: { conversationId, senderId: userId, body: text },
    });

    // Bump the conversation so it sorts to the top of the inbox (@updatedAt).
    await this.prisma.conversation.update({ where: { id: conversationId }, data: {} });

    return message;
  }
}
