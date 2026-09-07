import { IsString, IsNotEmpty, IsEnum, IsNumber, IsOptional, IsArray, IsUrl, Min } from 'class-validator';
import { MarketplaceListingType } from '@prisma/client';

export class CreateListingDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsEnum(MarketplaceListingType)
  type!: MarketplaceListingType;

  @IsNumber()
  @Min(0)
  price!: number;

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
