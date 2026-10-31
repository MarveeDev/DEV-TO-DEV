import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { RolesGuard } from '../admin/roles.guard';
import { Permissions } from '../admin/permissions.decorator';

@Controller('admin/analytics')
@UseGuards(RolesGuard)
@Permissions('analytics.view')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('summary')
  getSummary() {
    return this.analyticsService.getSummary();
  }

  @Get('timeseries')
  getTimeseries(@Query('from') from?: string, @Query('to') to?: string) {
    return this.analyticsService.getTimeseries(from, to);
  }
}
