import { ISocket } from './socket.interface';

export interface IGatewayConnection {
  handleConnection(client: ISocket): void;
  handleDisconnect(client: ISocket): void;
}
