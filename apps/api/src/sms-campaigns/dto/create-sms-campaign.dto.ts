import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateSmsCampaignDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1600)
  message!: string;
}
