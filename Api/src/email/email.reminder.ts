import { transporter } from './index'
import { compareAsc, format, addHours, addDays, endOfDay } from 'date-fns'
import eventRegistration from '../controllers/eventRegistration.controller';
import EventRegistration, { IEventRegistration } from '../models/eventRegistration';
import Ship, { IShip } from '../models/ship';
import Event, { IEvent } from '../models/event';
import User, { IUser } from '../models/user';

export const EmailReminder = async () =>{
  var nowDate = endOfDay(new Date());
  const result = addDays(nowDate, 4);

  const returnedEvents = await Event.find({ //query today up to 4 days ahead
    eventStart: {
        $gte: nowDate, 
        $lt: result
    }
  }); 
  if(!returnedEvents) return;
  const eventID = returnedEvents.filter(function (el){ 
    return el.eventId;
  });
  const res = returnedEvents.filter(({ eventId }) => eventId).map(({ eventId }) => eventId);

 console.log(res);
  returnedEvents.forEach(function() {
    /*
    const email = transporter.sendMail({
      from: '"Tregatta/Oxbridge" <oxbridge.noreply@gmail.com>',
      to: 'user.emailUsername',
      subject: "Event Reminder",
      text: "Your temporary password is: " ,
      headers: { 'x-myheader': 'Tregatta/Oxbridge Event' }
  
    }).catch((error: any) => {
      console.error(error);
    });*/
  });
  
 // console.log(returnedEvents);
}

export default EmailReminder;