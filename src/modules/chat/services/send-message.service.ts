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
          where: { blocked: false },
          select: { profileId: true, historyId: true },
        },
      },
    });

    if (!conversation) throw new Error('Conversation not found');

    await this.prismaService.message.create({
      data: {
        content,
        fromId: profileId,
        messageHistory: {
          createMany: {
            data: conversation.participants.map(({ historyId }) => ({
              historyId,
            })),
          },
        },
      },
    });

    return conversation.participants.map(({ profileId }) => profileId);
  }
}
