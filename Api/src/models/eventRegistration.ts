import mongoose, {Document, Schema} from 'mongoose';

export interface IEventRegistration extends Document {
  eventRegId: number,
  shipId : number,
  eventId : number,
  trackColor : string,
  teamName : string
}

const EventRegistrationSchema = new Schema({
  eventRegId: Number,
  shipId: Number,
  eventId: Number,
  trackColor: String,
  teamName: String,
});

export default mongoose.model<IEventRegistration>('EventRegistration',
    EventRegistrationSchema);
