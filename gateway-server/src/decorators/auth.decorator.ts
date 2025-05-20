import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { Role } from 'src/dtos/user.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RoleGuard } from 'src/guards/role.guards';

/** 로그인이 필요한 API에 붙이는 데코레이터 */
export const AuthenticationRequired = () => UseGuards(JwtAuthGuard);

/**
 * 특정 role이 필요한 API에 붙이는 데코레이터
 * 만족하는 role이 하나라도 있으면 통과
 */
export const RoleRequired = (roleNames: Role[]) =>
  applyDecorators(
    SetMetadata('roleNames', roleNames),
    UseGuards(JwtAuthGuard, RoleGuard),
  );
