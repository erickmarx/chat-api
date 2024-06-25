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
          conversationOnProfiles: {
            conversationId,
            profileId: { in: profileIds },
          },
        },
      },
    });
  }
}
