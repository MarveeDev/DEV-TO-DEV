import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ProjectStatus } from '@prisma/client';
import { IsSafeUrl } from '../../common/validators/is-safe-url.decorator';

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @IsSafeUrl()
  githubUrl?: string;

  @IsOptional()
  @IsSafeUrl()
  demoUrl?: string;
}
