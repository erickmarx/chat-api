import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IUpdateSettingsDTO } from '../interfaces/update-settings.interface';

@Injectable()
export class SettingsService {
  constructor(private prismaService: PrismaService) {}

  async getSettings(profileId: string) {
    return await this.prismaService.chatSettings.findFirst({
      where: { profileId },
    });
  }

  async createSettings(profileId: string) {
    return await this.prismaService.chatSettings.create({
      data: { profileId },
    });
  }

  async updateSettings(profileId: string, data: IUpdateSettingsDTO) {
    return await this.prismaService.chatSettings.update({
      where: { profileId },
      data,
    });
  }
}
