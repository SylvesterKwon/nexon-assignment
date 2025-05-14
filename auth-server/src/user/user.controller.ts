import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { SetRoleDto } from './dtos/user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('set-role')
  async setRole(@Body() dto: SetRoleDto) {
    await this.userService.setRole(dto.username, dto.role);
    return {
      message: '역할이 성공적으로 설정되었습니다.',
    };
  }
}
