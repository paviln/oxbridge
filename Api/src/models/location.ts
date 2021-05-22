import Mongoose, {Document, Schema} from 'mongoose';

export interface ILocationSchema extends Document {
    locationTime: Date,
    longtitude: number,
    latitude: number,
    racePointNumber : number,
    raceScore : number,
    finishTime : Date,
    eventRegId: number,
}

const LocationSchema: Schema = new Schema({
  locationTime: Date,
  longtitude: Number,
  latitude: Number,
  racePointNumber: Number,
  raceScore: Number,
  finishTime: Date,
  eventRegId: Number,
});

export default Mongoose.model<ILocationSchema>('Location', LocationSchema);
