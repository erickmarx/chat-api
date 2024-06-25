import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DeleteConversationService {
  constructor(private prismaService: PrismaService) {}

  async delete(profileId: string, conversationId: string): Promise<void> {
    const conversationOnProfile =
      await this.prismaService.conversationOnProfile.findFirst({
        where: { conversationId, profileId },
        select: { id: true },
      });

    if (!conversationOnProfile)
      throw new Error('Profile conversation not found');

    const history = await this.prismaService.history.findFirst({
      where: { conversationOnProfiles: { conversationId, profileId } },
      select: { id: true, messageHistory: { select: { id: true } } },
    });

    if (history) {
      await this.prismaService.$transaction([
        this.prismaService.history.delete({
          where: { id: history.id },
        }),
        this.prismaService.conversationOnProfile.update({
          where: { id: conversationOnProfile.id },
          data: { deleted: true },
        }),
        this.prismaService.messageHistory.deleteMany({
          where: { id: { in: history.messageHistory.map(({ id }) => id) } },
        }),
      ]);
    }
  }
}
