import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { rolesList } from 'src/common/utils/roles';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'users', timestamps: true })
export class User {
  @Prop()
  userName: string;

  @Prop()
  email: string;

  @Prop({ type: String, enum: rolesList, default: rolesList.User })
  role: rolesList;

  @Prop()
  password: string;

  @Prop()
  hashedRt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
