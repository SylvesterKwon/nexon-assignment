import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dtos/event.dto';

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

  @Get(':id')
  async getDetail(@Param('id') id: string) {
    const event = await this.eventService.getEventDetail(id);
    return {
      event,
    };
  }
}
