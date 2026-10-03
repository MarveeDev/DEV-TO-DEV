import { Module } from '@nestjs/common';
import { SmsCampaignsController } from './sms-campaigns.controller';
import { SmsCampaignsService } from './sms-campaigns.service';
import { RolesGuard } from '../admin/roles.guard';

@Module({
  controllers: [SmsCampaignsController],
  providers: [SmsCampaignsService, RolesGuard],
  exports: [SmsCampaignsService],
})
export class SmsCampaignsModule {}
