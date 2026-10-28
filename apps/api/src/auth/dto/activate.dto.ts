import { IsString, MinLength, MaxLength } from 'class-validator';

export class ActivateDto {
  @IsString()
  @MaxLength(512)
  token!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;
}
