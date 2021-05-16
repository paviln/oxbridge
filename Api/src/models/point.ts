import Mongoose, {Document, Schema} from 'mongoose';

export interface IPoint extends Document {
    type: string,
    firstLongtitude: number,
    firstLatitude: number,
    secondLongtitude: number,
    secondLatitude: number,
    racePointNumber: number,
    eventId: Mongoose.Types.ObjectId,
}

const PointSchema: Schema = new Schema({
  type: String,
  firstLongtitude: Number,
  firstLatitude: Number,
  secondLongtitude: Number,
  secondLatitude: Number,
  racePointNumber: Number,
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
  },
});

export default Mongoose.model<IPoint>('RacePoint', PointSchema);
