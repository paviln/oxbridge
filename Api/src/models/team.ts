import mongoose, {Document, Schema} from 'mongoose';

export interface ITeam extends Document {
  name: string,
  trackColor: string,
  leader: Schema.Types.ObjectId,
  members: Schema.Types.ObjectId[]
}

const TeamSchema: Schema = new Schema({
  name: String,
  trackColor: String,
  leader: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  events: [{
    type: Schema.Types.ObjectId,
    ref: 'Event',
  }],
});

export default mongoose.model<ITeam>('Team', TeamSchema);
