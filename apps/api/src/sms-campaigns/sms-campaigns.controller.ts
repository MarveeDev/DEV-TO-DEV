import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from '../admin/roles.guard';
import { Roles } from '../admin/roles.decorator';
import { SmsCampaignsService } from './sms-campaigns.service';
import { CreateSmsCampaignDto } from './dto/create-sms-campaign.dto';
import { UpdateSmsCampaignDto } from './dto/update-sms-campaign.dto';
import { SendTestSmsDto } from './dto/send-test-sms.dto';
import { SendCampaignDto } from './dto/send-campaign.dto';

@Controller('admin/sms-campaigns')
@UseGuards(RolesGuard)
@Roles('ADMIN')
export class SmsCampaignsController {
  constructor(private readonly smsCampaignsService: SmsCampaignsService) {}

  @Get()
  getCampaigns(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.smsCampaignsService.getCampaigns({ page, limit });
  }

  @Get(':id')
  getCampaign(@Param('id') id: string) {
    return this.smsCampaignsService.getCampaign(id);
  }

  @Post()
  createCampaign(@Body() data: CreateSmsCampaignDto) {
    return this.smsCampaignsService.createCampaign(data);
  }

  @Patch(':id')
  updateCampaign(@Param('id') id: string, @Body() data: UpdateSmsCampaignDto) {
    return this.smsCampaignsService.updateCampaign(id, data);
  }

  @Delete(':id')
  deleteCampaign(@Param('id') id: string) {
    return this.smsCampaignsService.deleteCampaign(id);
  }

  // ---- Recipients ----

  @Post(':id/recipients/import')
  @UseInterceptors(FileInterceptor('file'))
  importRecipients(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.smsCampaignsService.importRecipients(id, file);
  }

  @Get(':id/recipients')
  getRecipients(
    @Param('id') id: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.smsCampaignsService.getRecipients(id, { page, limit });
  }

  @Delete(':id/recipients/invalid')
  clearInvalidRecipients(@Param('id') id: string) {
    return this.smsCampaignsService.clearInvalidRecipients(id);
  }

  @Delete(':id/recipients')
  clearAllRecipients(@Param('id') id: string) {
    return this.smsCampaignsService.clearAllRecipients(id);
  }

  @Delete(':id/recipients/:recipientId')
  removeRecipient(
    @Param('id') id: string,
    @Param('recipientId') recipientId: string,
  ) {
    return this.smsCampaignsService.removeRecipient(id, recipientId);
  }

  // ---- Sending lifecycle ----

  @Post(':id/ready')
  markReady(@Param('id') id: string) {
    return this.smsCampaignsService.markReady(id);
  }

  @Post(':id/cancel')
  cancelCampaign(@Param('id') id: string) {
    return this.smsCampaignsService.cancelCampaign(id);
  }

  @Get(':id/send-preview')
  getSendPreview(@Param('id') id: string) {
    return this.smsCampaignsService.getSendPreview(id);
  }

  @Post(':id/test')
  sendTestSms(@Param('id') id: string, @Body() data: SendTestSmsDto) {
    return this.smsCampaignsService.sendTestSms(id, data.phoneNumber);
  }

  @Post(':id/send')
  sendCampaign(@Param('id') id: string, @Body() data: SendCampaignDto) {
    return this.smsCampaignsService.sendCampaign(id, data.confirmation);
  }
}
