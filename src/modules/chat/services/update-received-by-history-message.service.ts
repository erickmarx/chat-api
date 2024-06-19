import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UpdateReceivedByHistoryMessageService {
  constructor(private prismaService: PrismaService) {}

  async update(historyIds: string[]) {
    await this.prismaService.messageHistory.updateMany({
      where: { id: { in: historyIds } },
      data: { receivedAt: new Date() },
    });
  }
}
