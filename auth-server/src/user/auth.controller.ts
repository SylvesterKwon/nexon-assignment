import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { SignInDto, SignUpDto } from './dtos/user.dto';
import { UserService } from './user.service';

@Controller('auth')
export class AuthController {
  constructor(private userService: UserService) {}

  @Post('sign-up')
  async signUp(@Body() dto: SignUpDto) {
    if (dto.password !== dto.passwordConfirmation)
      throw new BadRequestException(
        '비밀번호와 비밀번호 확인 문자가 일치하지 않습니다.',
      );

    const user = await this.userService.createUser(dto.username, dto.password);

    return {
      message: '회원가입이 완료되었습니다.',
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    };
  }

  @Post('sign-in')
  async signIn(@Body() dto: SignInDto) {
    const accessToken = await this.userService.signIn(
      dto.username,
      dto.password,
    );
    return {
      message: '로그인에 성공했습니다.',
      accessToken,
    };
  }
}
