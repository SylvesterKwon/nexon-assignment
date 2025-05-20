import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum Role {
  USER = 'USER',
  OPERATOR = 'OPERATOR',
  AUDITOR = 'AUDITOR',
  ADMIN = 'ADMIN',
}

@Schema()
export class User {
  @Prop({
    required: true,
  })
  username: string;

  @Prop({
    required: true,
  })
  hashedPassword: string;

  @Prop({ type: String, enum: Role, default: Role.USER, required: true })
  role: Role;

  // 아래는 실 서비스에서는 별도의 모듈에서 받아와야 하지만, 구현 편의상 User 스키마에 넣었습니다.
  @Prop()
  completedQuestIds?: string[] = [];

  @Prop()
  loginStreak?: number = 0;

  @Prop()
  referralCount?: number = 0;
}

export const UserSchema = SchemaFactory.createForClass(User);
