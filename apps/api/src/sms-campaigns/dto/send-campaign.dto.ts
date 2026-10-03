import { IsNotEmpty, IsString } from 'class-validator';

export class SendCampaignDto {
  @IsString()
  @IsNotEmpty()
  confirmation!: string;
}
