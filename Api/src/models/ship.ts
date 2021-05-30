import mongoose, {Document, Schema} from 'mongoose';

export interface IShip extends Document {
  shipId: number,
  emailUsername: string,
  name: string,
  img:
  {
    data: Buffer,
    contentType: String
  },
}

const ShipSchema: Schema = new Schema({
  shipId: Number,
  emailUsername: String,
  name: String,
  img:
  {
    data: Buffer,
    contentType: String,
    select: false,
  },
});

export default mongoose.model<IShip>('Ship', ShipSchema);
