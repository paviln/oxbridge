import { Request, Response } from 'express';
import { NotFound } from 'express-http-custom-error';
import Event, { IEvent } from '../models/event';
import EventRegistration, { IEventRegistration } from '../models/eventRegistration';
import Ship, { IShip } from '../models/ship';
import RacePoint from '../models/racePoint';

// Create and Save a new Event
const create = (req: Request, res: Response) => {
  var event = new Event(req.body);

  // Finding next eventId
  Event.findOne({}).sort('-eventId').exec(function (err, lastEvent) {
    if (err)
      return res.status(500).send({ message: err.message || "Some error occurred while retriving events" });
    if (lastEvent)
      event.eventId = lastEvent.eventId + 1;
    else
      event.eventId = 1;
    // Saving the new Event in the DB
    event.save(function (err) {
      if (err)
        return res.send(err);
      res.status(201).json(event);
    });
  });
};

//Checking if event has a route
const hasRoute = (req: Request, res: Response) => {
  RacePoint.find({ eventId: +req.params.eventId }, { _id: 0, __v: 0 }, null, function (err, racepoints) {
    if (err)
      return res.status(500).send({ message: "false" });
    if (racepoints && racepoints.length !== 0)
      return res.status(200).send(true);
    else
      return res.status(200).send(false);
  })
}

// Retrieve and return all events from the database.
const findAll = (req: Request, res: Response) => {
  Event.find({}, { _id: 0, __v: 0 }, null, function (err, events) {
    if (err)
      return res.status(500).send({ message: err.message || "Some error occurred while retriving events" });

    res.status(200).json(events);
  });
};

//Get all events that the user is a participant of
var pending = 0;
const findFromUsername = (req: any, res: Response) => {
  // Finding all the ships the user owns
  var events: any[] = [];
  Ship.find({ emailUsername: req.user.id }, { _id: 0, __v: 0 }, null, function (err, ships) {
    if (err)
      return res.status(500).send({ message: err.message || "Some error occurred while retriving ships" });

    if (ships.length > 0) {
      //Finding all eventRegistrations with a ship that the user owns 
      ships.forEach(ship => {
        EventRegistration.find({ shipId: ship.shipId }, { _id: 0, __v: 0 }, null, function (err, eventRegistrations) {
          if (err)
            return res.status(500).send({ message: err.message || "Some error occurred while retriving eventRegistrations" });

          if (eventRegistrations) {
            eventRegistrations.forEach((eventRegistration: IEventRegistration) => {
              pending++;
              Ship.findOne({ shipId: eventRegistration.shipId }, { _id: 0, __v: 0 }, null, function (err, ship) {
                if (err)
                  return res.status(500).send({ message: err.message || "Some error occurred while retriving the ship" });

                if (ship) {
                  Event.findOne({ eventId: eventRegistration.eventId }, { _id: 0, __v: 0 }, null, function (err, event) {
                    pending--
                    if (err)
                      return res.status(500).send({ message: err.message || "Some error occurred while retriving the event" });

                    if (event) {
                      events.push({ "eventId": event.eventId, "name": event.name, "eventStart": event.eventStart, "eventEnd": event.eventEnd, "city": event.city, "eventRegId": eventRegistration.eventRegId, "shipName": ship.name, "teamName": eventRegistration.teamName, "isLive": event.isLive, "actualEventStart": event.actualEventStart });
                    }
                    if (pending == 0) {
                      res.status(200).send(events);
                    }
                  });
                }
              });
            });
          }
        });
      });
    } else {
      res.status(200).send(events);
    }
  });
};

// Find a single event with the given eventId
const findOne = (req: Request, res: Response) => {
  Event.findOne({ eventId: +req.params.eventId }, { _id: 0, __v: 0 }, null, function (err, event) {
    if (err)
      return res.status(500).send({ message: "Error retrieving event with eventId " + req.params.eventId });
    if (!event)
      return res.status(404).send({ message: "Event not found with eventId " + req.params.eventId });

    res.status(200).send(event);
  });
};

//Finding and updating event with the given eventId
const update = (req: Request, res: Response) => {
  var newEvent = req.body;
  newEvent.eventId = req.params.eventId;
  Event.updateOne({ eventId: +req.params.eventId }, newEvent, null, function (err, event) {
    if (err)
      return res.status(500).send({ message: err.message || "Error updating bikeRackStation with stationId " + req.params.eventId });
    if (!event)
      return res.status(404).send({ message: "BikeRackStation not found with stationId " + req.params.eventId });
    res.status(202).json(newEvent);
  });
};

//Changes event property "isLive" to true
const startEvent = (req: Request, res: Response) => {
  var updatedEvent = { isLive: true, actualEventStart: req.body.actualEventStart }
  Event.findOneAndUpdate({ eventId: +req.params.eventId }, updatedEvent, { new: true }, function (err, event) {
    if (err)
      return res.status(500).send({ message: "Error updating event with eventId " + req.params.eventId });
    if (!event)
      return res.status(404).send({ message: "Event not found with eventId " + req.params.eventId });

    res.status(202).json(event);
  });
};

//Changes event property "isLive" to false
const stopEvent = (req: Request, res: Response) => {
  Event.findOneAndUpdate({ eventId: +req.params.eventId }, { isLive: false }, { new: true }, function (err, event) {
    if (err)
      return res.status(500).send({ message: "Error updating event with eventId " + req.params.eventId });
    if (!event)
      return res.status(404).send({ message: "Event not found with eventId " + req.params.eventId });
    else
      res.status(202).json(event);
  })
}

// Delete an event with the specified eventId in the request
const remove = (req: Request, res: Response) => {
  // Finding and the deleting the event with the given eventId
  Event.findOneAndDelete({ eventId: +req.params.eventId }, null, function (err, event) {
    if (err)
      return res.status(500).send({ message: "Error deleting event with eventId " + req.params.eventId });
    if (!event)
      return res.status(404).send({ message: "Event not found with eventId " + req.params.eventId });

    //Finding and deleting every EventRegistration with the given eventId
    EventRegistration.deleteMany({ eventId: +req.params.eventId }, {}, function (err) {
      if (err)
        return res.status(500).send({ message: "Error deleting eventRegistration with eventId " + req.params.eventId });

      //Finding and deleting every RacePoint with the given eventId
      RacePoint.deleteMany({ eventId: +req.params.eventId }, {}, function (err) {
        if (err)
          return res.status(500).send({ message: "Error deleting RacePoints with eventId " + req.params.eventId });

        res.status(202).json(event);
      })
    })
  });
};

const sendMessage = async (req: Request, res: Response) => {
  const event = await Event.findOne({ eventId: +req.body.eventId });
  if (!event) throw new NotFound("Event not found with eventId " + req.body.eventId);
  
  event.messages.push(req.body.message);

  const result = await event.save();

  res.status(200).json(result);
}

export default {
  create,
  hasRoute,
  findAll,
  findFromUsername,
  findOne,
  update,
  startEvent,
  stopEvent,
  remove,
  sendMessage,
}