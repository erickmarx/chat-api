import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DeleteConversationService {
  constructor(private prismaService: PrismaService) {}

  async delete(profileId: string, conversationId: string) {
    const profileConversation =
      await this.prismaService.profileConversation.findFirst({
        where: { conversationId, profileId },
        select: { id: true },
      });

    if (!profileConversation) throw new Error('Profile conversation not found');

    const history = await this.prismaService.history.findFirst({
      where: { profileConversations: { conversationId, profileId } },
      select: { id: true },
    });

    if (history) {
      await this.prismaService.$transaction([
        this.prismaService.history.delete({
          where: { id: history.id },
        }),
        this.prismaService.profileConversation.update({
          where: { id: profileConversation.id },
          data: { deleted: true },
        }),
      ]);
    }
  }
}
