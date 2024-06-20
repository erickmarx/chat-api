import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { fromEvent, switchMap, tap } from 'rxjs';
import { IMessageEvent } from '../interfaces/message-event.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { IRetrieveMessages } from '../interfaces/retrieve-messages.interface';

@Injectable()
export class RetrieveMessagesService {
  constructor(
    private eventEmitter: EventEmitter2,
    private prismaService: PrismaService,
  ) {}

  async retrieve() {
    return fromEvent(this.eventEmitter, 'message:retrieve').pipe(
      tap(() => console.log('teste')),
      switchMap(
        async (
          messageHistoryIds: string[],
        ): Promise<IMessageEvent<IRetrieveMessages[]>> => {
          return { data: await this.retrieveMessages(messageHistoryIds) };
        },
      ),
      tap(async ({ data }) => {
        console.log('data', data);
        // await this.update(data.map(({ historyId }) => historyId));
      }),
    );
  }

  private async retrieveMessages(messageHistoryIds: string[]) {
    const historys = await this.prismaService.history.findMany({
      where: { messageHistory: { some: { id: { in: messageHistoryIds } } } },
      select: {
        id: true,
        messageHistory: {
          where: { receivedAt: null, viewedAt: null },
          select: {
            message: {
              select: {
                id: true,
                content: true,
                fromId: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    return historys.map((history) => {
      return {
        historyId: history.id,
        messages: history.messageHistory.map(({ message }) => message),
      };
    });
  }

  private async update(historyIds: string[]) {
    await this.prismaService.messageHistory.updateMany({
      where: { id: { in: historyIds } },
      data: { receivedAt: new Date() },
    });
  }
}
