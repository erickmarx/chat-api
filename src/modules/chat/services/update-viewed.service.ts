import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UpdateViewedService {
  constructor(private prismaService: PrismaService) {}

  async update(profileId: string, conversationId: string) {
    const conversation = await this.prismaService.conversation.findFirst({
      where: { id: conversationId, participants: { some: { profileId } } },
      select: { id: true },
    });

    if (!conversation) throw new Error('Conversation not found');

    const date = new Date();

    await this.prismaService.$transaction([
      this.prismaService.messageHistory.updateMany({
        where: {
          history: { profileConversations: { conversationId, profileId } },
          receivedAt: null,
        },
        data: { viewedAt: date, receivedAt: date },
      }),

      this.prismaService.messageHistory.updateMany({
        where: {
          history: { profileConversations: { conversationId, profileId } },
          viewedAt: null,
        },
        data: { viewedAt: date },
      }),
    ]);
  }
}
