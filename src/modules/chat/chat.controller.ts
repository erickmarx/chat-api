// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   Param,
//   Patch,
//   Post,
//   Query,
//   Sse,
// } from '@nestjs/common';
// import { GetHistoryPaginatedService } from './services/get-history-paginated.service';
// import { SendMessageService } from './services/send-message.service';
// import { ReceiveMessageService } from './services/receive-message.service';
// import { DeleteHistoryService } from './services/delete-history.service';
// import { PatchViewedService } from './services/patch-viewed.service';

// @Controller('chat')
// export class ChatController {
//   constructor(
//     private getHistoryPaginatedService: GetHistoryPaginatedService,
//     private postMessageService: SendMessageService,
//     private receiveMessageService: ReceiveMessageService,
//     private deleteHistoryService: DeleteHistoryService,
//     private patchViewedService: PatchViewedService,
//     private retrieveMessagesService: RetrieveMessagesService,
//   ) {}

//   @Sse('receive')
//   async receiveMessage(@Query('profileId') profileId: string) {
//     return await this.receiveMessageService.receive(profileId);
//   }

// @Get()
// async retrieveMessages(@Query('profileId') profileId: string) {
//   return await this.retrieveMessagesService.retrieve(profileId);
// }

//   @Get(':conversationId/history')
//   async getHistoryPaginated(
//     @Param('conversationId') conversationId: string,
//     @Query('profileId') profileId: string,
//   ) {
//     return await this.getHistoryPaginatedService.get(profileId, conversationId);
//   }

//   @Post(':conversationId/messages')
//   async postMessage(
//     @Param('conversationId') conversationId: string,
//     @Body('content') content: string,
//     @Query('profileId') profileId: string,
//   ) {
//     return await this.postMessageService.send(
//       profileId,
//       conversationId,
//       content,
//     );
//   }

//   @Patch(':conversationId/viewed')
//   async patchViewed(
//     @Query('profileId') profileId: string,
//     @Param('conversationId') conversationId: string,
//   ) {
//     return await this.patchViewedService.patch(profileId, conversationId);
//   }

//   @Delete(':conversationId/delete')
//   async deleteHistory(
//     @Query('profileId') profileId: string,
//     @Param('conversationId') conversationId: string,
//   ) {
//     return await this.deleteHistoryService.delete(profileId, conversationId);
//   }
// }
