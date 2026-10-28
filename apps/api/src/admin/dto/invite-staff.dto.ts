import { IsEmail, IsEnum } from 'class-validator';
import { UserRole } from '@prisma/client';

export class InviteStaffDto {
  @IsEmail()
  email!: string;

  @IsEnum(UserRole)
  role!: UserRole;
}
