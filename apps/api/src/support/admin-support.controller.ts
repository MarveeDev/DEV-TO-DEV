import { Controller, Get, Post, Patch, Param, Body, Req, Query, UseGuards } from '@nestjs/common';
import { SupportService } from './support.service';
import { RolesGuard } from '../admin/roles.guard';
import type { AuthenticatedAdminRequest } from '../admin/roles.guard';
import { Permissions } from '../admin/permissions.decorator';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { CreateStaffMessageDto } from './dto/create-staff-message.dto';
import { ListStaffTicketsQueryDto } from './dto/list-staff-tickets-query.dto';
import { RateLimit } from '../common/rate-limit/rate-limit.decorator';

@Controller('admin/support')
@UseGuards(RolesGuard)
@Permissions('support.manage')
export class AdminSupportController {
  constructor(private readonly supportService: SupportService) {}

  private actorId(req: AuthenticatedAdminRequest): string {
    return req.userId as string;
  }

  @Get('tickets')
  listTickets(@Query() query: ListStaffTicketsQueryDto) {
    return this.supportService.listStaffTickets(query);
  }

  @Get('tickets/:id')
  getTicket(@Param('id') id: string) {
    return this.supportService.getStaffTicket(id);
  }

  @Patch('tickets/:id')
  updateTicket(
    @Req() req: AuthenticatedAdminRequest,
    @Param('id') id: string,
    @Body() body: UpdateTicketDto,
  ) {
    return this.supportService.updateStaffTicket(this.actorId(req), id, body);
  }

  @Post('tickets/:id/messages')
  @RateLimit({ limit: 60, windowMs: 60_000, tier: 't3' })
  addMessage(
    @Req() req: AuthenticatedAdminRequest,
    @Param('id') id: string,
    @Body() body: CreateStaffMessageDto,
  ) {
    return this.supportService.addStaffMessage(this.actorId(req), id, body);
  }
}
