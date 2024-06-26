import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class HasMessageService {
  constructor(private prismaService: PrismaService) {}

  async has(profileId: string) {
    const profile = await this.prismaService.profile.findFirst({
      where: { id: profileId },
      select: { id: true },
    });

    if (!profile) throw new Error('Profile not found');

    const messages = await this.prismaService.messageHistory.findMany({
      where: {
        receivedAt: null,
        viewedAt: null,
        history: { conversationOnProfiles: { profileId } },
      },
      select: { id: true },
    });

    return messages;
  }
}
