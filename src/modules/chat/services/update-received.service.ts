import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UpdateReceivedService {
  constructor(private prismaService: PrismaService) {}

  async update(conversationId: string, profileIds: string[]) {
    await this.prismaService.messageHistory.updateMany({
      data: { receivedAt: new Date() },
      where: {
        history: {
          profileConversations: {
            conversationId,
            profileId: { in: profileIds },
          },
        },
      },
    });
    // const messages = await this.prismaService.message.findMany({
    //   where: {
    //     historyConversations: { every: { conversationId } },
    //     received: false,
    //     viewed: false,
    //   },
    //   select: { id: true },
    // });

    // return await this.prismaService.message.updateMany({
    //   where: {
    //     historyConversations: { every: { profileId: { in: profileIds } } },
    //     id: { in: messages.map(({ id }) => id) },
    //   },
    //   data: { received: true },
    // });

    // ==
    // const historyConversation =
    //   await this.prismaService.historyConversation.findFirst({
    //     where: { conversationId, profileId: { in: profileIds } },
    //     select: { id: true, received: true },
    //   });

    // return await this.prismaService.historyConversation.update({
    //   where: { id: historyConversation.id },
    //   data: { received: true },
    // });
  }
}
