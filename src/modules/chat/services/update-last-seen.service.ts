import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UpdateLastSeenService {
  constructor(private prismaService: PrismaService) {}

  async update(profileId: string, lastSeenAt: Date | null) {
    const a = await this.prismaService.profile.update({
      where: { id: profileId },
      data: { lastSeenAt },
      select: { conversationOnProfile: { select: { profileId: true } } },
    });

    return a.conversationOnProfile.map(({ profileId }) => profileId);
  }
}
