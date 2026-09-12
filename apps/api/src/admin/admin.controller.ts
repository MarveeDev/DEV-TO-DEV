import { Controller, Get, Post, Patch, Body, Param, Req, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { RolesGuard } from './roles.guard';
import type { AuthenticatedAdminRequest } from './roles.guard';
import { Roles } from './roles.decorator';
import { ChangeRoleDto } from './dto/change-role.dto';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';
import { CreateViolationDto } from './dto/create-violation.dto';
import { UpdateViolationStatusDto } from './dto/update-violation-status.dto';

@Controller('admin')
@UseGuards(RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  private actorId(req: AuthenticatedAdminRequest): string {
    return req.userId as string;
  }

  @Get('overview')
  @Roles('ADMIN', 'MODERATOR')
  getOverview() {
    return this.adminService.getOverview();
  }

  @Get('users')
  @Roles('ADMIN', 'MODERATOR')
  getUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('role') role?: string,
  ) {
    return this.adminService.getUsers({ page, limit, search, role });
  }

  @Get('users/:id')
  @Roles('ADMIN', 'MODERATOR')
  getUser(@Param('id') id: string) {
    return this.adminService.getUser(id);
  }

  @Patch('users/:id/role')
  @Roles('ADMIN')
  changeUserRole(@Req() req: AuthenticatedAdminRequest, @Param('id') id: string, @Body() data: ChangeRoleDto) {
    return this.adminService.changeUserRole(this.actorId(req), id, data.role);
  }

  @Get('marketplace/listings')
  @Roles('ADMIN', 'MODERATOR')
  getListings(@Query('page') page?: string, @Query('limit') limit?: string, @Query('search') search?: string) {
    return this.adminService.getListings({ page, limit, search });
  }

  @Get('marketplace/reports')
  @Roles('ADMIN', 'MODERATOR')
  getReports(@Query('page') page?: string, @Query('limit') limit?: string, @Query('status') status?: string) {
    return this.adminService.getReports({ page, limit, status });
  }

  @Get('marketplace/reports/:id')
  @Roles('ADMIN', 'MODERATOR')
  getReport(@Param('id') id: string) {
    return this.adminService.getReport(id);
  }

  @Patch('marketplace/reports/:id/status')
  @Roles('ADMIN', 'MODERATOR')
  updateReportStatus(
    @Req() req: AuthenticatedAdminRequest,
    @Param('id') id: string,
    @Body() data: UpdateReportStatusDto,
  ) {
    return this.adminService.updateReportStatus(this.actorId(req), id, data.status);
  }

  @Get('content/posts')
  @Roles('ADMIN', 'MODERATOR')
  getPosts(@Query('page') page?: string, @Query('limit') limit?: string, @Query('search') search?: string) {
    return this.adminService.getPosts({ page, limit, search });
  }

  @Get('content/questions')
  @Roles('ADMIN', 'MODERATOR')
  getQuestions(@Query('page') page?: string, @Query('limit') limit?: string, @Query('search') search?: string) {
    return this.adminService.getQuestions({ page, limit, search });
  }

  @Get('content/projects')
  @Roles('ADMIN', 'MODERATOR')
  getProjects(@Query('page') page?: string, @Query('limit') limit?: string, @Query('search') search?: string) {
    return this.adminService.getProjects({ page, limit, search });
  }

  @Get('violations')
  @Roles('ADMIN', 'MODERATOR')
  getViolations(@Query('page') page?: string, @Query('limit') limit?: string, @Query('status') status?: string) {
    return this.adminService.getViolations({ page, limit, status });
  }

  @Post('violations')
  @Roles('ADMIN', 'MODERATOR')
  createViolation(@Req() req: AuthenticatedAdminRequest, @Body() data: CreateViolationDto) {
    return this.adminService.createViolation(this.actorId(req), data);
  }

  @Patch('violations/:id/status')
  @Roles('ADMIN', 'MODERATOR')
  updateViolationStatus(
    @Req() req: AuthenticatedAdminRequest,
    @Param('id') id: string,
    @Body() data: UpdateViolationStatusDto,
  ) {
    return this.adminService.updateViolationStatus(this.actorId(req), id, data.status);
  }

  @Get('audit-logs')
  @Roles('ADMIN')
  getAuditLogs(@Query('page') page?: string, @Query('limit') limit?: string, @Query('action') action?: string) {
    return this.adminService.getAuditLogs({ page, limit, action });
  }
}
