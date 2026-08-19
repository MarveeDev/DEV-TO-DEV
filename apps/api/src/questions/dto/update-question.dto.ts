import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';
import { QuestionStatus } from '@prisma/client';

export class UpdateQuestionDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(QuestionStatus)
  @IsOptional()
  status?: QuestionStatus;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills?: string[];
}
