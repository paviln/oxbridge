import mongoose, {Document, Schema} from 'mongoose';

export interface IShip extends Document {
  shipId: number,
  emailUsername: string,
  name: string,
}

const ShipSchema: Schema = new Schema({
  shipId: Number,
  emailUsername: String,
  name: String,
});

export default mongoose.model<IShip>('Ship', ShipSchema);
