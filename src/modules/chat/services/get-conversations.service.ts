import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GetConversationsService {
  constructor(private prismaService: PrismaService) {}

  async get(profileId: string) {
    //RETORNAR HISTORICOS
    const profileConversation =
      await this.prismaService.profileConversation.findMany({
        where: { profileId, deleted: false },
        select: {
          id: true,
          historyId: true,
          conversationId: true,
          profile: { select: { id: true, name: true } },
        },
      });

    if (!profileConversation) throw new Error('Profile conversation not found');

    return profileConversation;
  }
}
