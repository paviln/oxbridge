import User, { IUser } from '../models/user';
import { Types } from 'mongoose';


export default class UserRepo {

  public static async findById(email: string): Promise<IUser> {

    try {
      User.findOne({email:email}).lean<IUser>().exec();
    } catch (error) {
      
    }
    return new User;
  }
}