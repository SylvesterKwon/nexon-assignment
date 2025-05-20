import { Controller, Get } from '@nestjs/common';
import { UserId } from 'src/common/decorator/user-id.decorator';
import { RewardService } from './reward.service';

@Controller('reward')
export class RewardController {
  constructor(private rewardService: RewardService) {}

  @Get('my-receipt-history')
  async getMyReceiptHistory(@UserId() userId: string) {
    return await this.rewardService.getMyReceiptHistory(userId);
  }

  @Get('receipt-history')
  async getReceiptHistory() {
    return await this.rewardService.getAllReceiptHistory();
  }
}
