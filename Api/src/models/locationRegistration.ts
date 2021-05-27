import Mongoose, {Document, Schema} from 'mongoose';

export interface ILocationRegistration extends Document {
  regId: number,
  eventRegId: number,
  locationTime: Date,
  longtitude: number,
  latitude: number,
  racePointNumber : number,
  raceScore : number,
  finishTime : Date,
}

const LocationRegistrationSchema = new Schema({
  regId: Number,
  eventRegId: Number,
  locationTime: Date,
  longtitude: Number,
  latitude: Number,
  racePointNumber: Number,
  raceScore: Number,
  finishTime: Date,
});

export default Mongoose.model<ILocationRegistration >('LocationRegistration', LocationRegistrationSchema);
