import {
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/dtos/user.dto';

@Injectable()
export class RoleGuard {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const roleNames = this.reflector.get<Role[]>(
      'roleNames',
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest();
    const userRole = request['user']?.['role'];

    if (roleNames.length === 0)
      throw new InternalServerErrorException(
        'API route에 대한 role 설정이 없습니다.',
      );
    if (userRole === Role.ADMIN)
      return true; // 암시적으로 ADMIN은 모든 role을 가짐
    else if (roleNames.includes(Role.USER))
      return true; // 모든 USER는 USER role을 가짐 (기본 role)
    else if (roleNames.includes(userRole))
      return true; // 요청자가 요구되는 role들 중 하나를 포함
    else return false;
  }
}
