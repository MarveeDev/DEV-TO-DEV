import { IsString, IsOptional, IsEnum, IsNotEmpty, MaxLength } from 'class-validator';
import { MarketplaceListingReportReason } from '@prisma/client';

export class CreateReportDto {
  @IsEnum(MarketplaceListingReportReason)
  @IsNotEmpty()
  reason!: MarketplaceListingReportReason;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;
}
