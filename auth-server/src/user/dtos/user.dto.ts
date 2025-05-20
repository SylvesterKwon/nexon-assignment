import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '../schemas/user.schema';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  username: string;
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsString()
  @IsNotEmpty()
  passwordConfirmation: string;
}

export class SignInDto {
  @IsString()
  @IsNotEmpty()
  username: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SetRoleDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEnum(Role)
  role: Role;
}

export class SetStatusDto {
  completedQuestIds?: string[];
  loginStreak?: number;
  referralCount?: number;
}
