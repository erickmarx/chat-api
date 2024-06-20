import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IMessagePayload } from '../interfaces/message-payload.interface';

@Injectable()
export class SendMessageService {
  constructor(private prismaService: PrismaService) {}

  async send(profileId: string, conversationId: string, content: string) {
    const profile = await this.prismaService.profile.findFirst({
      where: { id: profileId },
      select: { id: true },
    });

    if (!profile) throw new Error('Profile not found');

    //encontra conversa
    const conversation = await this.prismaService.conversation.findFirst({
      where: { id: conversationId },
      select: {
        participants: {
          where: {
            // conversation: { blockedConversation: { some: { blocked: false } } },
          },
          select: { id: true, profileId: true, historyId: true },
        },
      },
    });

    if (!conversation) throw new Error('Conversation not found');

    //atualizar visualização de quem enviou a mensagem
    await this.prismaService.message.create({
      data: {
        content,
        fromId: profileId,
        messageHistory: {
          createMany: {
            data: conversation.participants.map(
              ({ historyId, profileId: participantId }) =>
                participantId !== profileId
                  ? { historyId }
                  : { historyId, receivedAt: new Date(), viewedAt: new Date() },
            ),
          },
        },
      },
    });

    //precisa criar historico caso nao exista/conversa deletada

    await this.prismaService.profileConversation.updateMany({
      where: {
        id: { in: conversation.participants.map(({ id }) => id) },
      },
      data: { deleted: false, },
    });


    return conversation.participants.map(({ profileId }) => profileId);
  }
}
