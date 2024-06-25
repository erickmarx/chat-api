import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IGetConversations } from '../interfaces/get-conversations.interface';

@Injectable()
export class GetConversationsService {
  constructor(private prismaService: PrismaService) {}

  async get(profileId: string): Promise<IGetConversations[]> {
    const historys = await this.prismaService.history.findMany({
      where: { conversationOnProfiles: { profileId, deleted: false } },
      select: {
        id: true,
        conversationOnProfiles: {
          select: {
            id: true,
            conversationId: true,
            profile: { select: { id: true, name: true } },
          },
        },
      },
    });

    return historys.map((history) => ({
      id: history.conversationOnProfiles.id,
      conversationId: history.conversationOnProfiles.conversationId,
      profile: history.conversationOnProfiles.profile,
    }));
  }
}
