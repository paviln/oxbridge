import mongoose, {Document, Schema} from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  firstname: String,
  lastname: String,
  emailUsername: String,
  password: String,
  role: String,
}

const UserSchema: Schema = new Schema({
  firstname: String,
  lastname: String,
  emailUsername: String,
  password: String,
  role: String,
});

UserSchema.pre<IUser>('save', async function(next) {
  const user: IUser = this;
  const hash = await bcrypt.hash(user.password, 10);

  user.password = hash;
  next();
});

export default mongoose.model<IUser>('User', UserSchema);
