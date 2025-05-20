import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Reward } from '../types/reward.type';

export type RewardReceiptDocument = HydratedDocument<RewardReceipt>;

export enum RewardReceiptStatus {
  SUCCESS = 'SUCCESS',
  FAILED_CONDITION_UNMET = 'FAILED_CONDITION_UNMET',
  FAILED_ALREADY_RECEIVED = 'FAILED_ALREADY_RECEIVED',
}

@Schema()
export class RewardReceipt {
  @Prop({ required: true, default: Date.now })
  receiptDate: Date;

  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  event: Types.ObjectId;

  @Prop({ required: true })
  receipentId: string;

  @Prop({
    type: String,
    enum: RewardReceiptStatus,
    required: true,
  })
  status: RewardReceiptStatus;

  @Prop({ type: Object })
  receivedRewards: Reward[];
}

export const RewardReceiptSchema = SchemaFactory.createForClass(RewardReceipt);
