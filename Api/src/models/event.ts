import mongoose, {Document, Schema} from 'mongoose';

export interface IEvent extends Document {
  name: string,
  eventStart: Date,
  eventEnd: Date,
  city: string,
  eventCode: string,
  actualEventStart: Date,
  isLive: boolean,
  checked: boolean
}

const EventSchema: Schema = new Schema({
  name: String,
  eventStart: Date,
  eventEnd: Date,
  city: String,
  eventCode: String,
  actualEventStart: Date,
  isLive: Boolean,
  checked: Boolean
});

export default mongoose.model<IEvent>('Event', EventSchema);
