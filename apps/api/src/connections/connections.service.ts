import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ScoreService } from '../score/score.service';

@Injectable()
export class ConnectionsService {
  constructor(private prisma: PrismaService, private scoreService: ScoreService) {}

  async sendRequest(requesterId: string, targetUsername: string) {
    const targetProfile = await this.prisma.developerProfile.findUnique({
      where: { username: targetUsername },
      include: { user: true },
    });

    if (!targetProfile) {
      throw new NotFoundException('Developer not found');
    }

    const addresseeId = targetProfile.userId;

    if (requesterId === addresseeId) {
      throw new BadRequestException('You cannot connect with yourself');
    }

    // Check if relationship already exists
    const existingConnection = await this.prisma.connection.findFirst({
      where: {
        OR: [
          { requesterId, addresseeId },
          { requesterId: addresseeId, addresseeId: requesterId },
        ],
      },
    });

    if (existingConnection) {
      if (existingConnection.status === 'PENDING') {
        throw new BadRequestException('Connection request already pending');
      }
      if (existingConnection.status === 'ACCEPTED') {
        throw new BadRequestException('You are already connected');
      }
      if (existingConnection.status === 'REJECTED' || existingConnection.status === 'CANCELLED') {
        // Can re-request, so we'll update it or recreate
        return this.prisma.connection.update({
          where: { id: existingConnection.id },
          data: { status: 'PENDING', requesterId, addresseeId },
        });
      }
    }

    const newConnection = await this.prisma.connection.create({
      data: {
        requesterId,
        addresseeId,
        status: 'PENDING',
      },
    });

    const requesterProfile = await this.prisma.developerProfile.findUnique({ where: { userId: requesterId } });
    
    // Create notification
    await this.prisma.notification.create({
      data: {
        userId: addresseeId,
        type: 'CONNECTION_REQUEST',
        title: 'New Connection Request',
        message: `${requesterProfile?.displayName || 'Someone'} wants to connect with you.`,
      },
    });

    return newConnection;
  }

  async getConnections(userId: string) {
    return this.prisma.connection.findMany({
      where: {
        status: 'ACCEPTED',
        OR: [{ requesterId: userId }, { addresseeId: userId }],
      },
      include: {
        requester: { include: { developerProfile: true } },
        addressee: { include: { developerProfile: true } },
      },
    });
  }

  async getRequests(userId: string) {
    return this.prisma.connection.findMany({
      where: {
        status: 'PENDING',
        OR: [{ requesterId: userId }, { addresseeId: userId }],
      },
      include: {
        requester: { include: { developerProfile: true } },
        addressee: { include: { developerProfile: true } },
      },
    });
  }

  async acceptRequest(userId: string, connectionId: string) {
    const connection = await this.prisma.connection.findUnique({
      where: { id: connectionId },
    });

    if (!connection) throw new NotFoundException('Connection request not found');
    if (connection.addresseeId !== userId) throw new ForbiddenException('You cannot accept this request');
    if (connection.status !== 'PENDING') throw new BadRequestException('Request is not pending');

    const updated = await this.prisma.connection.update({
      where: { id: connectionId },
      data: { status: 'ACCEPTED' },
    });

    const addresseeProfile = await this.prisma.developerProfile.findUnique({ where: { userId: userId } });

    // Create notification for requester
    await this.prisma.notification.create({
      data: {
        userId: connection.requesterId,
        type: 'CONNECTION_ACCEPTED',
        title: 'Connection Accepted',
        message: `${addresseeProfile?.displayName || 'Someone'} accepted your connection request.`,
      },
    });

    // Award score to both users for successful connection
    this.scoreService.recordConnectionActivity(connection.requesterId).catch(e => console.error(e));
    this.scoreService.recordConnectionActivity(userId).catch(e => console.error(e));

    return updated;
  }

  async rejectRequest(userId: string, connectionId: string) {
    const connection = await this.prisma.connection.findUnique({
      where: { id: connectionId },
    });

    if (!connection) throw new NotFoundException('Connection request not found');
    if (connection.addresseeId !== userId) throw new ForbiddenException('You cannot reject this request');
    if (connection.status !== 'PENDING') throw new BadRequestException('Request is not pending');

    const updated = await this.prisma.connection.update({
      where: { id: connectionId },
      data: { status: 'REJECTED' },
    });

    return updated;
  }

  async deleteConnection(userId: string, connectionId: string) {
    const connection = await this.prisma.connection.findUnique({
      where: { id: connectionId },
    });

    if (!connection) throw new NotFoundException('Connection not found');
    if (connection.requesterId !== userId && connection.addresseeId !== userId) {
      throw new ForbiddenException('You cannot modify this connection');
    }

    return this.prisma.connection.delete({
      where: { id: connectionId },
    });
  }
}
