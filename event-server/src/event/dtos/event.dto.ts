import { IsNotEmpty, IsString } from 'class-validator';
import { Reward } from '../types/reward.type';
import { Condition } from '../types/event.type';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  // validation 추가하면 더 안전함. 우선순위는 낮음
  condition: Condition;
  rewards: Reward[];
}

export class SetRewardDto {
  rewards: Reward[];
}
