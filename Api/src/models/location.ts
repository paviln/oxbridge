import Mongoose, {Document, Schema} from 'mongoose';

export interface ILocationSchema extends Document {
  locationTime: Date,
  longtitude: number,
  latitude: number,
  racePointNumber : number,
  raceScore : number,
  finishTime : Date,
}

const LocationSchema: Schema = new Schema({
  locationTime: Date,
  longtitude: Number,
  latitude: Number,
  racePointNumber: Number,
  raceScore: Number,
  finishTime: Date,
});

export default Mongoose.model<ILocationSchema>('Location', LocationSchema);
