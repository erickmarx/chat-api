import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { SettingsService } from './services/settings.service';
import { UpdateSettingsDTO } from './dto/update-settings.dto';

@Controller('chat')
export class ChatController {
  constructor(private settingsService: SettingsService) {}

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
