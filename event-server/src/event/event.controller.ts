import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto, SetRewardDto } from './dtos/event.dto';
import { UserId } from 'src/common/decorator/user-id.decorator';

@Controller('event')
export class EventController {
  constructor(private eventService: EventService) {}

  @Post('create')
  async createEvent(@Body() dto: CreateEventDto) {
    const event = await this.eventService.createEvent(dto);
    return {
      message: '이벤트 생성에 성공했습니다.',
      event,
    };
  }

  @Get('list')
  async list() {
    const { totalCount, results } = await this.eventService.getEventList();
    return {
      totalCount,
      results,
    };
  }

  @Get(':eventId')
  async getDetail(@Param('eventId') id: string) {
    const event = await this.eventService.getEventDetail(id);
    return {
      event,
    };
  }

  @Post(':eventId/set-reward')
  async setReward(@Param('eventId') id: string, @Body() dto: SetRewardDto) {
    const event = await this.eventService.setReward(id, dto);
    return {
      message: '보상 설정에 성공했습니다.',
      event,
    };
  }

  @Post(':eventId/request-reward')
  async requestReward(@Param('eventId') id: string, @UserId() userId: string) {
    const rewardReceipt = await this.eventService.provideReward(id, userId);
    return {
      message: '보상 수령에 성공했습니다.',
      rewardReceipt,
    };
  }
}
