import {
  IsArray,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsSafeUrl } from '../../common/validators/is-safe-url.decorator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  displayName?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsOptional()
  @IsSafeUrl()
  websiteUrl?: string;

  @IsOptional()
  @IsSafeUrl()
  githubUrl?: string;

  @IsString()
  @IsOptional()
  experienceLevel?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  goals?: string[];
}
