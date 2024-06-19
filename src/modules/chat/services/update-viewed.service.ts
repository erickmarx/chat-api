import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UpdateViewedService {
  constructor(private prismaService: PrismaService) {}

  async update(profileId: string, conversationId: string) {
    // if (!historyConversation) throw new Error('History conversation not found');

    await this.prismaService.messageHistory.updateMany({
      where: {
        history: { profileConversations: { conversationId, profileId } },
      },
      data: { viewedAt: new Date() },
    });
  }
}
