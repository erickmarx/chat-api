import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateViewedService } from './update-viewed.service';
import { IGetHistory } from '../interfaces/get-history.interface';

@Injectable()
export class GetHistoryPaginatedService {
  constructor(
    private prismaService: PrismaService,
    private updateViewedService: UpdateViewedService,
  ) {}

  //add pagination
  async get(profileId: string, conversationId: string): Promise<IGetHistory> {
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
          conversation: {
            select: {
              participants: {
                where: { NOT: { profileId } },
                select: {
                  profile: { select: { name: true, lastSeenAt: true } },
                },
              },
            },
          },
          history: {
            select: {
              id: true,
              messageHistory: {
                select: {
                  id: true,
                  message: {
                    select: {
                      id: true,
                      content: true,
                      fromId: true,
                      createdAt: true,
                    },
                  },
                },
                take: 3,
              },
            },
          },
        },
      });

    await this.updateViewedService.update(profileId, conversationId);

    return {
      profile: {
        name: profileConversation.conversation.participants[0].profile.name,
        lastSeenAt:
          profileConversation.conversation.participants[0].profile.lastSeenAt,
      },
      historyId: profileConversation.history.id,
      messages: profileConversation.history.messageHistory.map(
        (messageHistory) => messageHistory.message,
      ),
    };
  }
}
