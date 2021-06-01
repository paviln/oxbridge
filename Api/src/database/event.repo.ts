import Event, { IEvent } from '../models/event';
import { Types } from 'mongoose';
import { exec } from 'child_process';


export default class EventRepo {
  public static async findById(eventId: number): Promise<IEvent> {

    try {
      Event.findOne({eventId:eventId}).lean<IEvent>().exec();
    } catch (error) {
      console.log(error);
    }
    return new Event;
  }
  public static async findCheckedEvent(): Promise<IEvent> {
    return Event.find({checked: false, isLive: false})
      .lean<IEvent>()
      .exec();
  }
}