import Ship, { IShip } from '../models/ship';
import { Types } from 'mongoose';


export default class ShipRepo {

  public static async findById(email: Types.ObjectId): Promise<IShip> {
    return Ship.findOne({ email: email })
      .lean<IShip>()
      .exec();
  }

}