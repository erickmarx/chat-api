import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateViewedService } from './update-viewed.service';
import { IGetHistory } from '../interfaces/get-history.interface';
import { IGetHistoryDTO } from '../interfaces/get-history-dto.interface';

@Injectable()
export class GetHistoryPaginatedService {
  constructor(
    private prismaService: PrismaService,
    private updateViewedService: UpdateViewedService,
  ) {}

  async get(profileId: string, data: IGetHistoryDTO): Promise<IGetHistory> {
    const profile = await this.prismaService.profile.findFirst({
      where: { id: profileId },
      select: { id: true },
    });

    if (!profile) throw new Error('Profile not found');

    const conversation = await this.prismaService.conversation.findFirst({
      where: { id: data.conversationId, participants: { some: { profileId } } },
      select: { id: true },
    });

    if (!conversation) throw new Error('Conversation not found');

    const profileConversation =
      await this.prismaService.profileConversation.findFirst({
        where: { profileId, conversationId: data.conversationId },
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
                skip: data.page * data.limit,
                take: data.limit,
              },
            },
          },
        },
      });

    await this.updateViewedService.update(profileId, data.conversationId);

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
