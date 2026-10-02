import { Module } from '@nestjs/common';
import { GonlineClient } from './gonline.client';
import { SmsService } from './sms.service';

@Module({
  providers: [GonlineClient, SmsService],
  exports: [SmsService],
})
export class SmsModule {}
