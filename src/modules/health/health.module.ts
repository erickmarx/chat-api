import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { PrismaModule } from '../prisma/prisma.module';
import { HealthGateway } from './health.gateway';

@Module({
  imports: [PrismaModule],
  controllers: [HealthController],
  providers: [HealthGateway,HealthService],
})
export class HealthModule {}
