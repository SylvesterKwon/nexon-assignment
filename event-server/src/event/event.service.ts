import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventDto, SetRewardDto } from './dtos/event.dto';
import { Event } from './schemas/event.schema';
import {
  RewardReceipt,
  RewardReceiptStatus,
} from './schemas/reward-receipt.schema';
import { Condition } from './types/event.type';
import { AuthServerClient } from './clients/auth-server.client';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(RewardReceipt.name)
    private rewardReceiptModel: Model<RewardReceipt>,
    private authServerClient: AuthServerClient,
  ) {}

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

  async setReward(id: string, dto: SetRewardDto) {
    const event = await this.eventModel.findById(id);
    if (!event) throw new NotFoundException('이벤트를 찾을 수 없습니다.');
    event.rewards = dto.rewards;
    await event.save();
    return event;
  }

  async provideReward(eventId: string, userId: string) {
    const event = await this.eventModel.findById(eventId);
    if (!event) throw new NotFoundException('이벤트를 찾을 수 없습니다.');

    // 이미 보상을 수령했는지 확인
    const existingReceipt = await this.rewardReceiptModel.findOne({
      event: event._id,
      receipentId: userId,
      status: RewardReceiptStatus.SUCCESS,
    });
    if (existingReceipt) {
      const rewardReceipt = new this.rewardReceiptModel({
        event: event._id,
        receipentId: userId,
        status: RewardReceiptStatus.FAILED_ALREADY_RECEIVED,
      });
      await rewardReceipt.save();
      throw new BadRequestException('이미 보상을 수령했습니다.');
    }

    const isConditionMet = await this.checkConditionMet(
      userId,
      event.condition,
    );
    if (!isConditionMet) {
      const rewardReceipt = new this.rewardReceiptModel({
        event: event._id,
        receipentId: userId,
        status: RewardReceiptStatus.FAILED_CONDITION_UNMET,
      });
      await rewardReceipt.save();
      throw new BadRequestException('조건을 만족하지 않습니다.');
    }

    // 보상 수령내역 저장
    const rewards = event.rewards;
    const rewardReceipt = new this.rewardReceiptModel({
      event: event._id,
      receipentId: userId,
      status: RewardReceiptStatus.SUCCESS,
      receivedRewards: rewards,
    });
    return await rewardReceipt.save();
  }

  private async checkConditionMet(userId: string, condition: Condition) {
    const data = await this.authServerClient.getUserStatus(userId);
    const userStatus = data.status;
    if (!userStatus)
      throw new InternalServerErrorException(
        '유저 상태를 가져오는 데 실패했습니다.',
      );
    let conditionMet = true;
    // 조건 검사하는 로직은 각 조건을 클래스로 만들고 분리하면 읽기 쉬워질 것 같음
    condition.forEach((cond) => {
      switch (cond.type) {
        case 'quest':
          if (
            !userStatus.completedQuestIds?.length ||
            !userStatus.completedQuestIds.includes(cond.questId)
          ) {
            console.log(
              'quest X',
              userStatus.completedQuestIds,
              userStatus.completedQuestIds?.includes,
            );
            conditionMet = false;
          }
          break;
        case 'referral':
          if (
            userStatus.referralCount === undefined ||
            !(userStatus.referralCount < cond.referralCount)
          ) {
            console.log('referral X');
            conditionMet = false;
          }
          break;
        case 'loginStreak':
          if (
            !userStatus.loginStreak ||
            userStatus.loginStreak < cond.loginStreak
          ) {
            console.log('loginStreak X');
            conditionMet = false;
          }

          break;
        default:
          throw new NotImplementedException('아직 지원하지 않는 조건입니다.');
      }
    });
    return conditionMet;
  }
}
