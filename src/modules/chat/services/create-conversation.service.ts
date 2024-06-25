import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ICreateConversation } from '../interfaces/create-conversation.interface';

@Injectable()
export class CreateConversationService {
  constructor(private prismaService: PrismaService) {}

  async create(
    profileId: string,
    participantId: string,
  ): Promise<ICreateConversation> {
    const profile = await this.prismaService.profile.findFirst({
      where: { AND: [{ id: profileId }, { id: participantId }] },
      select: { id: true },
    });

    if (!profile) throw new Error('Profile not found');

    const conversation = await this.prismaService.conversation.findFirst({
      where: {
        // blockedConversation: {
        //   every: {
        //     blocked: false,
        //     profileId: {
        //       in: [profileId, participantId],
        //     },
        //   },
        // },
        participants: {
          every: {
            profileId: {
              in: [profileId, participantId],
            },
          },
        },
      },
      select: { id: true },
    });

    if (conversation) return { conversationId: conversation.id };

    const createdConversation = await this.prismaService.$transaction(
      async () => {
        return await this.prismaService.conversation.create({
          data: {
            participants: {
              createMany: {
                data: [
                  {
                    profileId,
                    historyId: await this.prismaService.history
                      .create({
                        data: {},
                      })
                      .then((data) => data.id),
                  },
                  {
                    profileId: participantId,
                    historyId: await this.prismaService.history
                      .create({
                        data: {},
                      })
                      .then((data) => data.id),
                  },
                ],
              },
            },
          },
        });
      },
    );

    return { conversationId: createdConversation.id };
  }
}
