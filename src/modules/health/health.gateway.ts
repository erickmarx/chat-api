import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway()
export class HealthGateway {
  @SubscribeMessage('health')
  health() {
    return 'ok';
  }
}
