import Event, {IEvent} from '../models/event';
import { Types } from 'mongoose';


export default class EventRepo{


    public static async findById(id: Types.ObjectId): Promise<IEvent> {
        return Event.findOne({ _id: id })
        .lean<IEvent>()
        .exec();
      }

}