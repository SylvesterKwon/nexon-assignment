import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { SetRoleDto, SetStatusDto } from './dtos/user.dto';

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

  @Get(':userId/status')
  async getStatus(@Param('userId') userId: string) {
    const status = await this.userService.getStatus(userId);
    return {
      status,
    };
  }

  @Post(':userId/status')
  async setStatus(@Param('userId') userId: string, @Body() dto: SetStatusDto) {
    const status = await this.userService.setStatus(userId, dto);
    return {
      message: '상태가 성공적으로 설정되었습니다.',
      status,
    };
  }
}
