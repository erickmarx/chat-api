import { Module } from '@nestjs/common';
import { GetHistoryPaginatedService } from './services/get-history-paginated.service';
import { PrismaModule } from '../prisma/prisma.module';
import { SendMessageService } from './services/send-message.service';
import { ChatGateway } from './chat.gateway';
import { CreateConversationService } from './services/create-conversation.service';
import { HandleConnectionService } from './services/handle-connection.service';
import { UpdateReceivedService } from './services/update-received.service';
import { GetConversationsService } from './services/get-conversations.service';
import { UpdateLastSeenService } from './services/update-last-seen.service';
import { UpdateViewedService } from './services/update-viewed.service';

@Module({
  imports: [PrismaModule,],
  providers: [
    ChatGateway,
    HandleConnectionService,
    GetHistoryPaginatedService,
    SendMessageService,
    CreateConversationService,
    UpdateReceivedService,
    GetConversationsService,
    UpdateLastSeenService,
    UpdateViewedService,
  ],
})
export class ChatModule {}
