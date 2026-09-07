import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { SessionsModule } from '../sessions/sessions.module';

@Module({
  imports: [SessionsModule],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
