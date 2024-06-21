import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { ISocket } from './socket.interface';

export interface IGatewayConnection
  extends OnGatewayConnection,
    OnGatewayDisconnect {
  handleConnection(client: ISocket): void;
  handleDisconnect(client: ISocket): void;
}
