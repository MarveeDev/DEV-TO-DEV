import { Controller, Get, Post, Patch, Delete, Body, Param, Req, Query, UseGuards, NotFoundException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { RolesGuard } from './roles.guard';
import type { AuthenticatedAdminRequest } from './roles.guard';
import { Roles } from './roles.decorator';
import { Permissions } from './permissions.decorator';
import { ChangeRoleDto } from './dto/change-role.dto';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';
import { CreateViolationDto } from './dto/create-violation.dto';
import { UpdateViolationStatusDto } from './dto/update-violation-status.dto';
import { InviteStaffDto } from './dto/invite-staff.dto';
import { ChangeStatusDto } from './dto/change-status.dto';

@Controller('admin')
@UseGuards(RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  private actorId(req: AuthenticatedAdminRequest): string {
    return req.userId as string;
  }

  @Get('overview')
  @Permissions('overview.view')
  getOverview(@Req() req: AuthenticatedAdminRequest) {
    return this.adminService.getOverview(req.role);
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
  @Permissions('users.manage')
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

  @Get('staff')
  @Permissions('staff.manage')
  getStaff(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('role') role?: string,
  ) {
    return this.adminService.listStaff({ page, limit, search, role });
  }

  @Get('staff/find-by-email')
  @Permissions('staff.manage')
  async findStaffByEmail(@Query('email') email?: string) {
    const user = await this.adminService.findUserByEmail(email ?? '');
    if (!user) throw new NotFoundException('No account found for this email');
    return { user };
  }

  @Post('staff/invites')
  @Permissions('staff.manage')
  inviteStaff(@Req() req: AuthenticatedAdminRequest, @Body() data: InviteStaffDto) {
    return this.adminService.inviteStaff(this.actorId(req), data.email, data.name, data.role);
  }

  @Get('staff/invites')
  @Permissions('staff.manage')
  listInvites() {
    return this.adminService.listInvites();
  }

  @Post('staff/invites/:id/resend')
  @Permissions('staff.manage')
  resendInvite(@Req() req: AuthenticatedAdminRequest, @Param('id') id: string) {
    return this.adminService.resendInvite(this.actorId(req), id);
  }

  @Delete('staff/invites/:id')
  @Permissions('staff.manage')
  revokeInvite(@Req() req: AuthenticatedAdminRequest, @Param('id') id: string) {
    return this.adminService.revokeInvite(this.actorId(req), id);
  }

  @Patch('staff/users/:id/status')
  @Permissions('staff.manage')
  setStaffStatus(@Req() req: AuthenticatedAdminRequest, @Param('id') id: string, @Body() data: ChangeStatusDto) {
    return this.adminService.setStaffStatus(this.actorId(req), id, data.status);
  }
}
