import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';

@Injectable()
export class MarketplaceService {
  constructor(private readonly prisma: PrismaService) {}

  private async getProfileId(userId: string) {
    const profile = await this.prisma.developerProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!profile) {
      throw new BadRequestException('Developer profile required to perform this action');
    }
    return profile.id;
  }

  async createListing(userId: string, data: CreateListingDto) {
    const sellerId = await this.getProfileId(userId);

    return this.prisma.marketplaceListing.create({
      data: {
        ...data,
        sellerId,
      },
      include: {
        seller: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          }
        }
      }
    });
  }

  async findAll(query: { category?: string; type?: string; search?: string }) {
    const where: any = {};
    
    if (query.category) {
      where.category = query.category;
    }
    
    if (query.type) {
      where.type = query.type;
    }
    
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.marketplaceListing.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        seller: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          }
        }
      }
    });
  }

  async findMyListings(userId: string) {
    const sellerId = await this.getProfileId(userId);

    return this.prisma.marketplaceListing.findMany({
      where: { sellerId },
      orderBy: { createdAt: 'desc' },
      include: {
        seller: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          }
        }
      }
    });
  }

  async findOne(id: string) {
    const listing = await this.prisma.marketplaceListing.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          }
        }
      }
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    return listing;
  }

  async updateListing(userId: string, id: string, data: UpdateListingDto) {
    const sellerId = await this.getProfileId(userId);
    
    const listing = await this.prisma.marketplaceListing.findUnique({
      where: { id },
      select: { sellerId: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.sellerId !== sellerId) {
      throw new ForbiddenException('You do not own this listing');
    }

    return this.prisma.marketplaceListing.update({
      where: { id },
      data,
      include: {
        seller: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          }
        }
      }
    });
  }

  async deleteListing(userId: string, id: string) {
    const sellerId = await this.getProfileId(userId);
    
    const listing = await this.prisma.marketplaceListing.findUnique({
      where: { id },
      select: { sellerId: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.sellerId !== sellerId) {
      throw new ForbiddenException('You do not own this listing');
    }

    await this.prisma.marketplaceListing.delete({
      where: { id },
    });

    return { success: true };
  }
}
