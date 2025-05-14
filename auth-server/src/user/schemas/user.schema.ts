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
}

export const UserSchema = SchemaFactory.createForClass(User);
