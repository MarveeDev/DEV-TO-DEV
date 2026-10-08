import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ProjectStatus } from '@prisma/client';
import { IsSafeUrl } from '../../common/validators/is-safe-url.decorator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @IsSafeUrl()
  githubUrl?: string;

  @IsOptional()
  @IsSafeUrl()
  demoUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];
}
