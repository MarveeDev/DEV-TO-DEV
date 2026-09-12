import { IsEnum } from 'class-validator';
import { ViolationStatus } from '@prisma/client';

export class UpdateViolationStatusDto {
  @IsEnum(ViolationStatus)
  status!: ViolationStatus;
}
