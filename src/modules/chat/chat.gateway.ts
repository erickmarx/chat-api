import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { GetHistoryPaginatedService } from './services/get-history-paginated.service';
import { SendMessageService } from './services/send-message.service';
import { CreateConversationService } from './services/create-conversation.service';
import { HandleConnectionService } from './services/handle-connection.service';
import { ISocket } from './interfaces/socket.interface';
import { IServer } from './interfaces/server.interface';
import { UpdateReceivedService } from './services/update-received.service';
import { GetConversationsService } from './services/get-conversations.service';
import { UpdateViewedService } from './services/update-viewed.service';
import { DeleteHistoryService } from './services/delete-history.service';
import { DeleteConversationService } from './services/delete-conversation.service';
import { BlockConversationService } from './services/block-history.service';
import { IGatewayConnection } from './interfaces/gateway-connection.interface';

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway implements IGatewayConnection {
  @WebSocketServer() server: IServer;

  constructor(
    private handleConnectionService: HandleConnectionService,
    private createConversationService: CreateConversationService,
    private getHistoryPaginatedService: GetHistoryPaginatedService,
    private sendMessageService: SendMessageService,
    private updateReceivedService: UpdateReceivedService,
    private getConversationsService: GetConversationsService,
    private updateViewedService: UpdateViewedService,
    private deleteHistoryService: DeleteHistoryService,
    private deleteConversationService: DeleteConversationService,
    private blockConversationService: BlockConversationService,
  ) {}

  async handleConnection(client: ISocket) {
    await this.handleConnectionService.connect(client, this.server);

    console.log(this.server.profiles);
  }

  async handleDisconnect(client: ISocket) {
    await this.handleConnectionService.disconnect(client, this.server);

    console.log(this.server.profiles);
  }

  @SubscribeMessage('conversation:create')
  async handleCreateConversation(
    @ConnectedSocket() { profileId }: ISocket,
    @MessageBody() data: { participantId: string },
  ) {
    return await this.createConversationService.create(
      profileId,
      data.participantId,
    );
  }

  @SubscribeMessage('message:send')
  async handleSendMessage(
    @ConnectedSocket() { profileId }: ISocket,
    @MessageBody() data: { conversationId: string; content: string },
  ) {
    const profiles = await this.sendMessageService.send(
      profileId,
      data.conversationId,
      data.content,
    );

    const profilesReceived = profiles.filter((profile) => {
      const socketId = this.server.profiles.get(profile);
      console.log(socketId);

      if (!socketId) {
        return false;
      }

      this.server.to(socketId).emit('message:receive'); //message:receive or message:has //subscribe mobile

      return true;
    });

    await this.updateReceivedService.update(
      data.conversationId,
      profilesReceived,
    );
  }

  @SubscribeMessage('history:get')
  async handleGetHistory(
    @ConnectedSocket() { profileId }: ISocket,
    @MessageBody() data: { conversationId: string },
  ) {
    return await this.getHistoryPaginatedService.get(
      profileId,
      data.conversationId,
    );
  }

  @SubscribeMessage('conversation:get')
  async handleGetConversations(@ConnectedSocket() { profileId }: ISocket) {
    return await this.getConversationsService.get(profileId);
  }

  @SubscribeMessage('message:viewed')
  async handleUpdateViewed(
    @ConnectedSocket() { profileId }: ISocket,
    @MessageBody() data: { conversationId: string },
  ) {
    return await this.updateViewedService.update(
      profileId,
      data.conversationId,
    );
  }

  @SubscribeMessage('history:delete')
  async handleDeleteHistory(
    @ConnectedSocket() { profileId }: ISocket,
    @MessageBody() data: { conversationId: string },
  ) {
    return await this.deleteHistoryService.delete(
      profileId,
      data.conversationId,
    );
  }

  @SubscribeMessage('conversation:delete')
  async handleDeleteConversation(
    @ConnectedSocket() { profileId }: ISocket,
    @MessageBody() data: { conversationId: string },
  ) {
    return await this.deleteConversationService.delete(
      profileId,
      data.conversationId,
    );
  }

  @SubscribeMessage('conversation:block')
  async handleBlockConversation(
    @ConnectedSocket() { profileId }: ISocket,
    @MessageBody() data: { conversationId: string; block: boolean },
  ) {
    return await this.blockConversationService.block(
      profileId,
      data.conversationId,
      data.block,
    );
  }
}
