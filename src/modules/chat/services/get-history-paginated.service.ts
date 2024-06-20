import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GetHistoryPaginatedService {
  constructor(private prismaService: PrismaService) {}

  async get(profileId: string, conversationId: string) {
    const profile = await this.prismaService.profile.findFirst({
      where: { id: profileId },
      select: { id: true },
    });

    //validar profileId
    if (!profile) throw new Error('Profile not found');

    //validar conversationId
    const conversation = await this.prismaService.conversation.findFirst({
      where: { id: conversationId, participants: { some: { profileId } } },
      select: { id: true },
    });

    if (!conversation) throw new Error('Conversation not found');

    const profileConversation =
      await this.prismaService.profileConversation.findFirst({
        where: { profileId, conversationId },
        select: {
          history: {
            select: {
              messageHistory: {
                select: {
                  message: {
                    select: { content: true, fromId: true, createdAt: true },
                  },
                },
                take: 3,
              },
            },
          },
        },
      });

    return {
      history: profileConversation.history.messageHistory.map(
        (messageHistory) => messageHistory.message,
      ),
    };
  }
}
