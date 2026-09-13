import { Module } from '@nestjs/common';
import { ConnectionsController } from './connections.controller';
import { ConnectionsService } from './connections.service';
import { SessionsModule } from '../sessions/sessions.module';
import { ScoreModule } from '../score/score.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [SessionsModule, ScoreModule, NotificationsModule],
  controllers: [ConnectionsController],
  providers: [ConnectionsService],
})
export class ConnectionsModule {}
