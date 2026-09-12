import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';

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

  private serializeListing(listing: any) {
    if (!listing) return null;
    return {
      id: listing.id,
      title: listing.title,
      price: listing.price,
      currency: listing.currency,
      imageUrl: listing.imageUrl,
      seller: listing.seller
        ? { username: listing.seller.username, displayName: listing.seller.displayName }
        : null,
    };
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

    let conversation = await this.prisma.conversation.findFirst({
      where: { userAId, userBId, listingId: null },
    });
    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: { userAId, userBId, listingId: null },
      });
    }

    return conversation;
  }

  // Create (or reuse) the marketplace conversation between the current user and
  // the seller of the given listing. The buyer/seller pair is keyed together with
  // the listing id, so the same buyer can hold separate conversations per listing.
  async getOrCreateMarketplaceConversation(userId: string, listingId: string) {
    const listing = await this.prisma.marketplaceListing.findUnique({
      where: { id: listingId },
      include: { seller: { include: { user: true } } },
    });
    if (!listing) throw new NotFoundException('Listing not found');

    const sellerUserId = listing.seller.userId;
    if (sellerUserId === userId) {
      throw new BadRequestException('You cannot message yourself about your own listing');
    }

    const [userAId, userBId] = this.orderPair(userId, sellerUserId);

    let conversation = await this.prisma.conversation.findFirst({
      where: { userAId, userBId, listingId },
    });
    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: { userAId, userBId, listingId },
      });
    }

    return this.getConversationThread(userId, conversation.id);
  }

  async getConversations(userId: string) {
    const conversations = await this.prisma.conversation.findMany({
      where: { OR: [{ userAId: userId }, { userBId: userId }] },
      include: {
        userA: { include: { developerProfile: true } },
        userB: { include: { developerProfile: true } },
        listing: { select: { id: true, title: true } },
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
          listing: c.listing ? { id: c.listing.id, title: c.listing.title } : null,
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
        listing: {
          include: { seller: { select: { username: true, displayName: true } } },
        },
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
      listing: this.serializeListing(conversation.listing),
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

    // Notify the other participant for marketplace conversations.
    if (conversation.listingId) {
      const recipientId = conversation.userAId === userId ? conversation.userBId : conversation.userAId;
      const senderProfile = await this.prisma.developerProfile.findUnique({
        where: { userId },
        select: { displayName: true },
      });
      const listingTitle = conversation.listing?.title;
      await this.prisma.notification.create({
        data: {
          userId: recipientId,
          type: NotificationType.MESSAGE,
          title: 'New message',
          message: `${senderProfile?.displayName || 'Someone'} sent you a message${
            listingTitle ? ` about "${listingTitle}"` : ''
          }.`,
        },
      });
    }

    return message;
  }
}
