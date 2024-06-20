import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [PrismaModule, ChatModule],
  controllers: [AppController],
})
export class AppModule {}
