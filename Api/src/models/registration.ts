import mongoose, {Document, Schema} from 'mongoose';

export interface IRegistration extends Document {
  teamId: mongoose.Types.ObjectId,
  eventId: mongoose.Types.ObjectId
}

const RegistrationSchema: Schema = new Schema({
  teamId: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
});

export default mongoose.model<IRegistration>('Registration',
    RegistrationSchema);
