/* eslint-disable no-invalid-this */
import mongoose, {Document, Schema} from 'mongoose';
import bcrypt from 'bcryptjs';

export enum Roles {
  User = 1,
  Admin = 2,
}

export interface IUser extends Document {
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  role: Roles
}

const UserSchema: Schema = new Schema({
  firstname: String,
  lastname: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Roles,
    default: Roles.User,
  },
});

UserSchema.pre<IUser>('save', async function(next) {
  const user: IUser = this;
  if (!user.isModified('password')) return next();
  const hash = await bcrypt.hash(user.password, 10);
  user.password = hash;
  next();
});

export default mongoose.model<IUser>('User', UserSchema);
