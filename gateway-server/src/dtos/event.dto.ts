import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  condition: object;
  @ApiProperty()
  rewards: object[];
}

export class SetRewardDto {
  @ApiProperty()
  rewards: object[];
}
