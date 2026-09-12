import { IsString, IsOptional, IsEnum, IsNotEmpty, MaxLength } from 'class-validator';
import { ViolationType, ViolationSeverity } from '@prisma/client';

export class CreateViolationDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsOptional()
  reportId?: string;

  @IsEnum(ViolationType)
  type!: ViolationType;

  @IsEnum(ViolationSeverity)
  severity!: ViolationSeverity;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;
}
