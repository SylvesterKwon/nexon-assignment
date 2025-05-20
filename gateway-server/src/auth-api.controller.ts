import { HttpService } from '@nestjs/axios';
import { Controller, Get, HttpException, Post, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { AxiosError, HttpStatusCode } from 'axios';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import {
  Role,
  SetRoleDto,
  SetStatusDto,
  SignInDto,
  SignUpDto,
} from './dtos/user.dto';
import {
  AuthenticationRequired,
  RoleRequired,
} from './decorators/auth.decorator';

@ApiTags('auth-api')
@Controller('auth-api')
export class AuthApiController {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}
  private baseUrl = this.configService.get<string>('serviceUrl.authApi');

  private async forward(req: Request) {
    const newUrl = this.baseUrl + '/' + req.url.split('/').slice(2).join('/'); // /auth-api/aaa/bbb -> /aaa/bbb
    try {
      const response = await firstValueFrom(
        this.httpService.request({
          method: req.method,
          url: newUrl,
          data: req.body,
          params: req.query,
          headers: {
            'x-user-id': req['user']?.['userId'],
          }, // 다른 필요한 header 도 필요해진다면 포워딩하기
        }),
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const status =
          error.response?.status || HttpStatusCode.InternalServerError;
        const statusText =
          error.response?.statusText || 'Internal Server Error';

        throw new HttpException(statusText, status);
      }
      throw error;
    }
  }

  // AUTH
  @ApiProperty({
    description: '회원가입을 하는데 사용되는 API 입니다.',
  })
  @ApiBody({ type: SignUpDto })
  @Post('auth/sign-up')
  async signUp(@Req() req: Request) {
    return await this.forward(req);
  }

  @ApiBody({ type: SignInDto })
  @ApiProperty({
    description:
      '로그인을 하는데 사용되는 API 입니다. 본 API response body의 accessToken을 사용하여 이후 API를 호출합니다.',
  })
  @Post('auth/sign-in')
  async signIn(@Req() req: Request) {
    return await this.forward(req);
  }

  // USER
  @ApiProperty({
    description: '특정 유저를 특정 role로 변경합니다.',
  })
  @ApiBody({ type: SetRoleDto })
  @Post('user/set-role')
  async setRole(@Req() req: Request) {
    return await this.forward(req);
  }

  @ApiProperty({
    description: '유저의 이벤트 완료 조건 확인을 위한 상태를 조회합니다.',
  })
  @ApiParam({ name: 'userId', type: 'string' })
  @ApiBearerAuth('JWT-auth')
  @RoleRequired([Role.OPERATOR, Role.AUDITOR])
  @Get('user/:userId/status')
  async getUserStatus(@Req() req: Request) {
    return await this.forward(req);
  }

  @ApiProperty({
    description: '유저의 이벤트 완료 조건 확인을 위한 상태를 설정합니다.',
  })
  @ApiParam({ name: 'userId', type: 'string' })
  @ApiBody({ type: SetStatusDto })
  @ApiBearerAuth('JWT-auth')
  @RoleRequired([Role.OPERATOR, Role.AUDITOR])
  @Post('user/:userId/status')
  async setUserStatus(@Req() req: Request) {
    return await this.forward(req);
  }

  // 인증/인가 TEST용 API
  @ApiBearerAuth('JWT-auth')
  @RoleRequired([Role.OPERATOR, Role.AUDITOR])
  @Get('authorization-test')
  authorizationTest() {
    return {
      message: 'Success',
    };
  }

  @ApiBearerAuth('JWT-auth')
  @AuthenticationRequired()
  @Get('authentication-test')
  authenticationTest() {
    return {
      message: 'Success',
    };
  }
}
