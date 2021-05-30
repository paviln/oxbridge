import Mongoose, {Document, Schema} from 'mongoose';

export interface IRacePoint extends Document {
  racePointId: number,
  type: string,
  firstLongtitude: number,
  firstLatitude: number,
  secondLongtitude: number,
  secondLatitude: number,
  eventId: number,
  racePointNumber: number,
}

const RacePointSchema = new Schema({
  racePointId: Number,
  type: String,
  firstLongtitude: Number,
  firstLatitude: Number,
  secondLongtitude: Number,
  secondLatitude: Number,
  eventId: Number,
  racePointNumber: Number,
});

export default Mongoose.model<IRacePoint>('RacePoint', RacePointSchema);
