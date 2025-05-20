import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from './schemas/event.schema';
import {
  RewardReceipt,
  RewardReceiptSchema,
} from './schemas/reward-receipt.schema';
import { AuthServerClient } from './clients/auth-server.client';
import { HttpModule } from '@nestjs/axios';
import { RewardController } from './reward.controller';
import { RewardService } from './reward.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: RewardReceipt.name, schema: RewardReceiptSchema },
    ]),
  ],
  controllers: [EventController, RewardController],
  providers: [EventService, RewardService, AuthServerClient],
  exports: [],
})
export class EventModule {}
