import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Condition } from '../types/event.type';
import { Reward } from '../types/reward.type';

export type EventDocument = HydratedDocument<Event>;

@Schema()
export class Event {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: Object })
  condition: Condition;

  @Prop({
    required: true,
    type: Object,
  })
  rewards: Reward[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
