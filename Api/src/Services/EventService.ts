import {addDays, endOfDay} from 'date-fns'
import Event, {IEvent} from '../models/event';
import EventRegistration from '../models/eventRegistration';
import Ship from '../models/ship';
import User, {IUser} from '../models/user';
import {SendReminder} from '../Services/EmailService';

const GetEventParticipents = async (eventId: number) => {
  const eventRegistrations = await EventRegistration.find({ eventId: eventId });
  if (!eventRegistrations || eventRegistrations.length === 0) throw new Error("No registrations found for event with eventId: " + eventId);
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

const SendEventReminder = async () => {
  var nowDate = endOfDay(new Date());
  const extendDate = addDays(nowDate, 4);

   //query today up to 4 days ahead
  const returnedEvents: IEvent[] = await Event.find({
    eventStart: {
        $gte: nowDate, 
        $lt: extendDate,
    }
  }); 
  if (returnedEvents)
  returnedEvents.forEach(async (event) => {
    const participents: IUser[] = await GetEventParticipents(event.eventId);
    if (participents) {
      participents.forEach(async (participent) => {
        await SendReminder(participent.emailUsername, event.eventStart);
      });
    }
  });
}
export {
  SendEventReminder,
}