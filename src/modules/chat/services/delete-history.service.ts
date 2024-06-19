import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DeleteHistoryService {
  constructor(private prismaService: PrismaService) {}
  async delete(profileId: string, conversationId: string) {
    const history = await this.prismaService.history.findFirst({
      where: { profileConversations: { conversationId, profileId } },
      select: { id: true },
    });

    if (!history) throw new Error('History conversation not found');

    await this.prismaService.$transaction([
      this.prismaService.messageHistory.deleteMany({
        where: {
          historyId: history.id,
        },
      }),
      this.prismaService.history.deleteMany({
        where: { id: history.id },
      }),
    ]);
  }
}
