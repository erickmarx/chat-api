import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BlockConversationService {
  constructor(private prismaService: PrismaService) {}

  async block(profileId: string, conversationId: string, blocked: boolean) {
    const conversation = await this.prismaService.conversation.findFirst({
      where: { id: conversationId },
      select: { id: true },
    });

    if (!conversation) throw new Error('Conversation not found');

    await this.prismaService.blockedConversation.create({
      data: { profileId, conversationId },
    });
  }
}
