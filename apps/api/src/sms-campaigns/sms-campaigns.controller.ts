import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from '../admin/roles.guard';
import type { AuthenticatedAdminRequest } from '../admin/roles.guard';
import { Permissions } from '../admin/permissions.decorator';
import {
  SmsCampaignsService,
  MAX_CSV_FILE_SIZE,
} from './sms-campaigns.service';
import { CreateSmsCampaignDto } from './dto/create-sms-campaign.dto';
import { UpdateSmsCampaignDto } from './dto/update-sms-campaign.dto';
import { SendTestSmsDto } from './dto/send-test-sms.dto';
import { SendCampaignDto } from './dto/send-campaign.dto';
import { RateLimit } from '../common/rate-limit/rate-limit.decorator';

@Controller('admin/sms-campaigns')
@UseGuards(RolesGuard)
@Permissions('marketing.manage')
export class SmsCampaignsController {
  constructor(private readonly smsCampaignsService: SmsCampaignsService) {}

  private actorId(req: AuthenticatedAdminRequest): string {
    return req.userId as string;
  }

  @Get()
  getCampaigns(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.smsCampaignsService.getCampaigns({ page, limit });
  }

  @Get(':id')
  getCampaign(@Param('id') id: string) {
    return this.smsCampaignsService.getCampaign(id);
  }

  @Post()
  createCampaign(@Req() req: AuthenticatedAdminRequest, @Body() data: CreateSmsCampaignDto) {
    return this.smsCampaignsService.createCampaign(this.actorId(req), data);
  }

  @Patch(':id')
  updateCampaign(@Req() req: AuthenticatedAdminRequest, @Param('id') id: string, @Body() data: UpdateSmsCampaignDto) {
    return this.smsCampaignsService.updateCampaign(this.actorId(req), id, data);
  }

  @Delete(':id')
  deleteCampaign(@Req() req: AuthenticatedAdminRequest, @Param('id') id: string) {
    return this.smsCampaignsService.deleteCampaign(this.actorId(req), id);
  }

  // ---- Recipients ----

  @Post(':id/recipients/import')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: MAX_CSV_FILE_SIZE } }),
  )
  @RateLimit({ limit: 10, windowMs: 3_600_000, tier: 't3' })
  importRecipients(
    @Req() req: AuthenticatedAdminRequest,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.smsCampaignsService.importRecipients(this.actorId(req), id, file);
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
  markReady(@Req() req: AuthenticatedAdminRequest, @Param('id') id: string) {
    return this.smsCampaignsService.markReady(this.actorId(req), id);
  }

  @Post(':id/cancel')
  cancelCampaign(@Req() req: AuthenticatedAdminRequest, @Param('id') id: string) {
    return this.smsCampaignsService.cancelCampaign(this.actorId(req), id);
  }

  @Get(':id/send-preview')
  getSendPreview(@Param('id') id: string) {
    return this.smsCampaignsService.getSendPreview(id);
  }

  @Post(':id/test')
  @RateLimit({ limit: 5, windowMs: 3_600_000, tier: 't5', failClosed: true })
  sendTestSms(@Param('id') id: string, @Body() data: SendTestSmsDto) {
    return this.smsCampaignsService.sendTestSms(id, data.phoneNumber);
  }

  @Post(':id/send')
  @RateLimit({ limit: 1, windowMs: 300_000, tier: 't5', failClosed: true })
  sendCampaign(@Req() req: AuthenticatedAdminRequest, @Param('id') id: string, @Body() data: SendCampaignDto) {
    return this.smsCampaignsService.sendCampaign(this.actorId(req), id, data.confirmation);
  }
}
