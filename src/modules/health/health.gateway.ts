import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { IServer } from '../chat/interfaces/server.interface';

@WebSocketGateway()
export class HealthGateway {
  @WebSocketServer() server: IServer;

  @SubscribeMessage('health')
  health() {
    this.server.emit('health', 'ok');
  }
}
