import mongoose, {Document, Schema} from 'mongoose';

export interface IEvent extends Document {
  eventId: number,
  name: string,
  eventStart: Date,
  eventEnd: Date,
  city: string,
  eventCode: string,
  actualEventStart: Date,
  isLive: boolean,
  checked: boolean,
  eventRegId: number,
  messages: string[],
}

const EventSchema: Schema = new Schema({
  eventId: Number,
  name: String,
  eventStart: Date,
  eventEnd: Date,
  city: String,
  eventCode: String,
  actualEventStart: Date,
  isLive: Boolean,
  eventRegId: Number,
  messages: [String],
});

export default mongoose.model<IEvent>('Event', EventSchema);
