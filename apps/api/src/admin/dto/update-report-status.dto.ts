import { IsEnum } from 'class-validator';
import { MarketplaceListingReportStatus } from '@prisma/client';

export class UpdateReportStatusDto {
  @IsEnum(MarketplaceListingReportStatus)
  status!: MarketplaceListingReportStatus;
}
