import { IsString, IsOptional } from 'class-validator';

export class UpdateAnswerDto {
  @IsString()
  @IsOptional()
  content?: string;
}
