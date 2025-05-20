import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RewardReceipt } from './schemas/reward-receipt.schema';

@Injectable()
export class RewardService {
  constructor(
    @InjectModel(RewardReceipt.name)
    private rewardReceiptModel: Model<RewardReceipt>,
  ) {}

  async getMyReceiptHistory(userId: string) {
    const receipts = await this.rewardReceiptModel
      .find({ receipentId: userId })
      .sort({ createdAt: -1 })
      .exec();

    return {
      totalCount: receipts.length,
      results: receipts,
    };
  }
  async getAllReceiptHistory() {
    const receipts = await this.rewardReceiptModel
      .find()
      .sort({ createdAt: -1 })
      .exec();

    return {
      totalCount: receipts.length,
      results: receipts,
    };
  }
}
