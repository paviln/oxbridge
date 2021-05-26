import Mongoose, {Document, Schema} from 'mongoose';

export interface IRegistration extends Document {
  shipId: number,
  eventId: number,
  trackColor: string,
  teamName: string,
}

const RegistrationSchema = new Schema({
  shipId: Number,
  eventId: Number,
  trackColor: String,
  teamName: String,
});

export default Mongoose.model<IRegistration>('Registration', RegistrationSchema);
