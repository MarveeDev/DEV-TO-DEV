import { IsString, IsNotEmpty, IsOptional, IsEnum, MaxLength } from 'class-validator';
import { SupportMessageKind } from '@prisma/client';

export class CreateStaffMessageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  body!: string;

  @IsOptional()
  @IsEnum(SupportMessageKind)
  kind?: SupportMessageKind;
}
