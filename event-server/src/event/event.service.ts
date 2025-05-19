import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventDto } from './dtos/event.dto';

@Injectable()
export class EventService {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}

  async createEvent(dto: CreateEventDto) {
    const event = new this.eventModel({
      name: dto.name,
      condition: dto.condition,
      rewards: dto.rewards,
    });
    return await event.save();
  }

  async getEventList() {
    const events = await this.eventModel.find();
    const totalCount = await this.eventModel.countDocuments();
    return {
      totalCount,
      results: events,
    };
  }

  async getEventDetail(id: string) {
    const event = await this.eventModel.findById(id);
    if (!event) throw new NotFoundException('이벤트를 찾을 수 없습니다.');
    return event;
  }
}
