import { Injectable } from '@nestjs/common';
import { IServer } from '../interfaces/server.interface';
import { HasMessageService } from './has-message.service';
import { ISocket } from '../interfaces/socket.interface';
import { UpdateLastSeenService } from './update-last-seen.service';
import { UpdateReceivedByHistoryMessageService } from './update-received-by-history-message.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class GatewayConnectionService {
  constructor(
    private eventEmitter: EventEmitter2,
    private hasMessageService: HasMessageService,
    private updateLastSeenService: UpdateLastSeenService,
    private updateReceivedByHistoryMessageService: UpdateReceivedByHistoryMessageService,
  ) {}

  async connect(client: ISocket, server: IServer) {
    // console.log(client.args[0].handshake.headers.authorization.split(' ')[1]) //Bearer token jwt
    //authenticate
    const auth = client.handshake.headers.authorization;

    if (!auth) throw new Error('Unauthorized');

    // extract profileId from token
    // client.profileId = auth.profileId
    client.profileId = auth;

    if (!server.profiles) server.profiles = new Map<string, string>();

    server.profiles.set(client.profileId, client.id);

    //update lastseen
    const pairProfilesToUpdate = await this.updateLastSeenService.update(
      client.profileId,
      null,
    );

    //testar essa implementação de merda
    server.profiles.forEach(async (socketId, profileId) => {
      if (pairProfilesToUpdate.includes(profileId)) {
        this.eventEmitter.emit('profile:online', { profileId, lastSeen: null });

        // client
        //   .to(socketId)
        //   .emit('profile:online', { profileId, lastSeen: null });
      }
    });

    //recuperar mensagens nao recebidas
    const messageHistory = await this.hasMessageService.has(client.profileId);

    const messageHistoryIds = messageHistory.map(({ id }) => id);

    if (messageHistory.length) {
      this.eventEmitter.emit('message:retrieve', messageHistoryIds); //?? message:has

      // await this.updateReceivedByHistoryMessageService.update(
      //   messageHistoryIds,
      // );
    }
  }

  async disconnect(client: ISocket, server: IServer) {
    const lastSeen = new Date();

    const profilesToUpdate = await this.updateLastSeenService.update(
      client.profileId,
      lastSeen,
    );

    //testar essa implementação de merda
    server.profiles.forEach(async (socketId, profileId) => {
      if (profilesToUpdate.includes(profileId)) {
        this.eventEmitter.emit('profile:online', {
          profileId,
          lastSeen: new Date(),
        });

        // client.to(socketId).emit('profile:online', { profileId, lastSeen });
      }

      server.profiles.delete(client.profileId);
    });
  }
}
