import { IsNotEmpty, IsString } from 'class-validator';

export class SendTestSmsDto {
  @IsString()
  @IsNotEmpty()
  phoneNumber!: string;
}
