import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GetConversationsService {
  constructor(private prismaService: PrismaService) {}

  async get(profileId: string) {
    //RETORNAR HISTORICOS
    return await this.prismaService.conversation.findMany({
      where: {
        blockedConversation: { some: { blocked: false } },
        participants: {
          some: {
            profileId,
          },
        },
      },
    });
  }
}
