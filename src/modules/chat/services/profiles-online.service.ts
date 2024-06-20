import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { fromEvent, map } from 'rxjs';
import { IMessageEvent } from '../interfaces/message-event.interface';

@Injectable()
export class ProfilesOnlineService {
  constructor(private eventEmitter: EventEmitter2) {}

  profilesOnline() {
    return fromEvent(this.eventEmitter, 'profile:online').pipe(
      map(
        (data: {
          profileId: string;
          lastSeen: Date | null;
        }): IMessageEvent<{ profileId: string; status: Date | null }> => ({
          data: { profileId: data.profileId, status: data.lastSeen },
        }),
      ),
    );
  }
}
