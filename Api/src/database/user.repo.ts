import User, {IUser} from '../models/user';
import { Types } from 'mongoose';


export default class UserRepo{


    public static async findById(email: Types.ObjectId): Promise<IUser> {
        return User.findOne({ email: email })
          .populate({
            path: 'roles',
          })
          .lean<IUser>()
          .exec();
      }

}