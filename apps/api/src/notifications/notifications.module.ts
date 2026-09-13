import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationEvents } from './notification-events';
import { NotificationsGateway } from './notifications.gateway';
import { SessionsModule } from '../sessions/sessions.module';
import { PushModule } from './push/push.module';

@Module({
  imports: [SessionsModule, PushModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationEvents, NotificationsGateway],
  exports: [NotificationsService, NotificationEvents],
})
export class NotificationsModule {}
