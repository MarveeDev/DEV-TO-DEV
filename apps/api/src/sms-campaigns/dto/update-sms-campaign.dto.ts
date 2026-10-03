import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateSmsCampaignDto {
  @IsString()
  @IsOptional()
  @MaxLength(120)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1600)
  message?: string;
}
