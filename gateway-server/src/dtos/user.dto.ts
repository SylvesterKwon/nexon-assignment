import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  passwordConfirmation: string;
}

export class SignInDto {
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
}

export enum Role {
  USER = 'USER',
  OPERATOR = 'OPERATOR',
  AUDITOR = 'AUDITOR',
  ADMIN = 'ADMIN',
}

export class SetRoleDto {
  @ApiProperty()
  username: string;
  @ApiProperty({ enum: Role, enumName: 'Role' })
  role: Role;
}

export class SetStatusDto {
  @ApiProperty()
  completedQuestIds?: string[];
  @ApiProperty()
  loginStreak?: number;
  @ApiProperty()
  referralCount?: number;
}
