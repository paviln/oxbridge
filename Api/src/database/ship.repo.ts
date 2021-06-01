import Ship, { IShip } from '../models/ship';
import { Types } from 'mongoose';


export default class ShipRepo {

  public static async findById(_id: Number): Promise<IShip> {

    try {
      Ship.findOne({ _id: _id}).lean<IShip>().exec();
    } catch (error) {
      console.error(error)
      process.exit(1)
    }
    return new Ship;
  }

}