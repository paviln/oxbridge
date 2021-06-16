import {addDays, endOfDay} from 'date-fns'
import Event, {IEvent} from '../models/event';
import EventRegistration from '../models/eventRegistration';
import Ship from '../models/ship';
import User, {IUser} from '../models/user';
import {sendReminder} from './emailService';

// Finds all participants of events a event.
const GetEventParticipents = async (eventId: number) => {
  const eventRegistrations = await EventRegistration.find({ eventId: eventId });
  if (!eventRegistrations || eventRegistrations.length === 0){
    throw new Error("No registrations found for event with eventId: " + eventId);
  }
  var participants: IUser[] = [];
  for(var i = 0; i < eventRegistrations.length; i++) {
    const ship = await Ship.findOne({ shipId: eventRegistrations[i].shipId });
    if (ship) {
      const user = await User.findOne({ emailUsername: ship.emailUsername });      
      if (user) {
        participants.push(user);
      }
    }
  }

  return participants;
}
// Sends out reminder to all participants of events, which are starting soon.
const sendEventReminder = async () => {
  var nowDate = endOfDay(new Date());
  const extendDate = addDays(nowDate, 4);

   // Query from current moment, and 4 days in the future. 
  const returnedEvents: IEvent[] = await Event.find({
    eventStart: {
        $gte: nowDate, 
        $lt: extendDate,
    },
    checked: { $ne: true}
  }); 

  if (returnedEvents)
  await returnedEvents.forEach(async (event) => {
    const participents: IUser[] = await GetEventParticipents(event.eventId);
    if (participents) {
      participents.forEach(async (participent) => {
        await sendReminder(participent.emailUsername, event.eventStart);
      });
    }
    event.checked = true;
    await event.save();
  });
}
export {
  sendEventReminder,
}