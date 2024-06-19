import { Injectable } from '@nestjs/common';
import { OnGatewayConnection } from '@nestjs/websockets';
import { IServer } from '../interfaces/server.interface';
import { HasMessageService } from './has-message.service';
import { ISocket } from '../interfaces/socket.interface';
import { UpdateLastSeenService } from './update-last-seen.service';
import { UpdateReceivedByHistoryMessageService } from './update-received-by-history-message.service';

@Injectable()
export class HandleConnectionService implements OnGatewayConnection {
  constructor(
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
    const profilesToUpdate = await this.updateLastSeenService.update(
      client.profileId,
      null,
    );

    //testar essa implementação de merda
    server.profiles.forEach(async (socketId, profileId) => {
      if (profilesToUpdate.includes(profileId)) {
        client
          .to(socketId)
          .emit('profile:online', { profileId, lastSeen: null });
      }
    });

    //recuperar mensagens nao recebidas
    const hasMessage = await this.hasMessageService.has(client.profileId);

    if (hasMessage.length) {
      await client.emitWithAck('message:has', hasMessage); //?? message:has

      await this.updateReceivedByHistoryMessageService.update(
        hasMessage.map(({ id }) => id),
      );
    }
  }

  async disconnect(client: ISocket, server: IServer) {
    server.profiles.delete(client.profileId);

    const lastSeen = new Date();

    const profilesToUpdate = await this.updateLastSeenService.update(
      client.profileId,
      lastSeen,
    );

    //testar essa implementação de merda
    server.profiles.forEach(async (socketId, profileId) => {
      if (profilesToUpdate.includes(profileId)) {
        client.to(socketId).emit('profile:online', { profileId, lastSeen });
      }
    });
  }
}
