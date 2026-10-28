import { Module } from '@nestjs/common';
import { SupportController } from './support.controller';
import { AdminSupportController } from './admin-support.controller';
import { SupportService } from './support.service';
import { RolesGuard } from '../admin/roles.guard';
import { SessionsModule } from '../sessions/sessions.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [SessionsModule, NotificationsModule],
  controllers: [SupportController, AdminSupportController],
  providers: [SupportService, RolesGuard],
})
export class SupportModule {}
