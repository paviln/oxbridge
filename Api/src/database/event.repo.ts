import Event, {IEvent} from '../models/event';
import { Types } from 'mongoose';
import { exec } from 'child_process';


export default class EventRepo{


    public static async findById(id: Types.ObjectId): Promise<IEvent> {
        return Event.findOne({ _id: id })
        .lean<IEvent>()
        .exec();
      }

      public static async findCheckedEvent(): Promise<IEvent> {
        return Event.find({})
        .lean<IEvent>()
        .exec();
      }


}