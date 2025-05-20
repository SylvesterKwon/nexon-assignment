import { HttpService } from '@nestjs/axios';
import { Controller, Get, HttpException, Post, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { AxiosError, HttpStatusCode } from 'axios';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { Role } from './dtos/user.dto';
import { RoleRequired } from './decorators/auth.decorator';
import { CreateEventDto, SetRewardDto } from './dtos/event.dto';

@ApiTags('event-api')
@Controller('event-api')
export class EventApiController {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}
  private baseUrl = this.configService.get<string>('serviceUrl.eventApi');

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

  // EVENT
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: CreateEventDto })
  @RoleRequired([Role.OPERATOR, Role.ADMIN])
  @Post('event/create')
  async createEvent(@Req() req: Request) {
    return await this.forward(req);
  }

  @Get('event/list')
  async getEventList(@Req() req: Request) {
    return await this.forward(req);
  }

  @ApiParam({ name: 'eventId', type: 'string' })
  @Get('event/:id')
  async getEventDetail(@Req() req: Request) {
    return await this.forward(req);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'eventId', type: 'string' })
  @ApiBody({ type: SetRewardDto })
  @RoleRequired([Role.OPERATOR, Role.ADMIN])
  @Post('event/:eventId/set-reward')
  async setEventReward(@Req() req: Request) {
    return await this.forward(req);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'eventId', type: 'string' })
  @RoleRequired([Role.USER])
  @Post('event/:eventId/request-reward')
  async requestEventReward(@Req() req: Request) {
    return await this.forward(req);
  }

  // REWARD
  @ApiBearerAuth('JWT-auth')
  @RoleRequired([Role.USER])
  @Get('reward/my-receipt-history')
  async getMyReceiptHistory(@Req() req: Request) {
    console.log('!');
    return await this.forward(req);
  }

  @ApiBearerAuth('JWT-auth')
  @RoleRequired([Role.OPERATOR, Role.AUDITOR])
  @Get('reward/receipt-history')
  async getReceiptHistory(@Req() req: Request) {
    return await this.forward(req);
  }
}
