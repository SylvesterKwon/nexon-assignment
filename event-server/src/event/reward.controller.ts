import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dtos/event.dto';

@Controller('reward')
export class RewardController {
  constructor(private eventService: EventService) {}

  @Post('')
  async createEvent(@Body() dto: CreateEventDto) {
    const event = await this.eventService.createEvent(dto);
    return {
      message: '이벤트 생성에 성공했습니다.',
      event,
    };
  }
}
