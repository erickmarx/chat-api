import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GetHistoryPaginatedService {
  constructor(private prismaService: PrismaService) {}

  async get(profileId: string, conversationId: string) {
    //validar profileId
    //validar conversationId

    return await this.prismaService.profileConversation.findFirst({
      where: { profileId, conversationId },
      include: {
        history: {
          include: { messageHistory: { include: { message: true }, take: 3 } },
        },
      },
    });
  }
}
