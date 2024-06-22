import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller()
export class HealthController {
  constructor(private healthService: HealthService) {}
  @Get()
  async getHello(): Promise<any> {
    return await this.healthService.health();
  }
}
