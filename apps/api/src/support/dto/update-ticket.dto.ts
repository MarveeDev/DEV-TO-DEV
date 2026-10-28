import { IsString, IsOptional, IsEnum } from 'class-validator';
import { SupportTicketStatus, SupportTicketPriority } from '@prisma/client';

export class UpdateTicketDto {
  @IsOptional()
  @IsEnum(SupportTicketStatus)
  status?: SupportTicketStatus;

  @IsOptional()
  @IsEnum(SupportTicketPriority)
  priority?: SupportTicketPriority;

  @IsOptional()
  @IsString()
  assigneeId?: string;
}
