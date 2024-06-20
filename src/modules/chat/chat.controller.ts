import { Body, Controller, Get, Param, Patch, Sse } from '@nestjs/common';
import { SettingsService } from './services/settings.service';
import { UpdateSettingsDTO } from './dto/update-settings.dto';
import { ProfilesOnlineService } from './services/profiles-online.service';
import { Observable } from 'rxjs';
import { IMessageEvent } from './interfaces/message-event.interface';
import { RetrieveMessagesService } from './services/retrieve-messages.service';
import { IRetrieveMessages } from './interfaces/retrieve-messages.interface';

@Controller('chat')
export class ChatController {
  constructor(
    private settingsService: SettingsService,
    private profilesOnlineService: ProfilesOnlineService,
    private retrieveMessagesService: RetrieveMessagesService,
  ) {}

  @Sse('profiles/online')
  profilesOnline(): Observable<
    IMessageEvent<{
      profileId: string;
      status: Date | null;
    }>
  > {
    return this.profilesOnlineService.profilesOnline();
  }

  @Sse('retrieve/messages')
  async messages(): Promise<Observable<IMessageEvent<IRetrieveMessages[]>>> {
    return await this.retrieveMessagesService.retrieve();
  }

  @Get(':profileId/settings')
  async getSettings(@Param('profileId') profileId: string) {
    return await this.settingsService.getSettings(profileId);
  }

  @Patch(':profileId/settings')
  async settings(
    @Param('profileId') profileId: string,
    @Body() body: UpdateSettingsDTO,
  ) {
    return await this.settingsService.updateSettings(profileId, body);
  }
}
