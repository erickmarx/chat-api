import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GetConversationsService {
  constructor(private prismaService: PrismaService) {}

  async get(profileId: string) {
    return await this.prismaService.conversation.findMany({
      where: {
        participants: {
          some: {
            profileId,
            blocked: false,
          },
        },
      },
    });
  }
}
