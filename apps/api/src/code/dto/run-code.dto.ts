import { IsIn, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RunCodeDto {
  @IsIn(['python'])
  language: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  code: string;
}
