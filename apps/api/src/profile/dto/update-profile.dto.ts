import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  displayName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  bio?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  location?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  websiteUrl?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  githubUrl?: string;

  @IsString()
  @IsOptional()
  experienceLevel?: string;
}
