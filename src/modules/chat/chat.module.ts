import { Module } from '@nestjs/common';
import { GetHistoryPaginatedService } from './services/get-history-paginated.service';
import { PrismaModule } from '../prisma/prisma.module';
import { SendMessageService } from './services/send-message.service';
import { ChatGateway } from './chat.gateway';
import { CreateConversationService } from './services/create-conversation.service';
import { GatewayConnectionService } from './services/handle-connection.service';
import { UpdateReceivedService } from './services/update-received.service';
import { GetConversationsService } from './services/get-conversations.service';
import { UpdateLastSeenService } from './services/update-last-seen.service';
import { UpdateViewedService } from './services/update-viewed.service';
import { SettingsService } from './services/settings.service';
import { DeleteHistoryService } from './services/delete-history.service';
import { DeleteConversationService } from './services/delete-conversation.service';
import { BlockConversationService } from './services/block-history.service';
import { HasMessageService } from './services/has-message.service';
import { UpdateReceivedByHistoryMessageService } from './services/update-received-by-history-message.service';
import { ChatController } from './chat.controller';
import { ProfilesOnlineService } from './services/profiles-online.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RetrieveMessagesService } from './services/retrieve-messages.service';

@Module({
  imports: [PrismaModule, EventEmitterModule.forRoot()],
  controllers: [ChatController],
  providers: [
    ChatGateway,
    GatewayConnectionService,
    GetHistoryPaginatedService,
    SendMessageService,
    CreateConversationService,
    UpdateReceivedService,
    GetConversationsService,
    UpdateLastSeenService,
    UpdateViewedService,
    SettingsService,
    DeleteHistoryService,
    DeleteConversationService,
    BlockConversationService,
    HasMessageService,
    UpdateReceivedByHistoryMessageService,
    ProfilesOnlineService,
    RetrieveMessagesService,
  ],
})
export class ChatModule {}
