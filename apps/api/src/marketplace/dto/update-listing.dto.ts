import { IsString, IsEnum, IsNumber, IsOptional, IsArray, IsUrl, Min } from 'class-validator';
import { MarketplaceListingType } from '@prisma/client';

export class UpdateListingDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsEnum(MarketplaceListingType)
  @IsOptional()
  type?: MarketplaceListingType;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  externalUrl?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
