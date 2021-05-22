import {Request, Response} from 'express';
import Event, {IEvent} from '../models/event';
import Registration, {IRegistration} from '../models/registration';
import Team, {ITeam} from '../models/team';
import Point, {IPoint} from '../models/point';

// Create and Save a new Event
const create = async (req: Request, res: Response) => {
  // Saving the new Event in the DB
  const event: IEvent = req.body;
  await event.save(req.body);
  res.status(201).json(event);
};

// Checking if event has a route
const hasRoute = (req: Request, res: Response) => {
  const eventId = req.params.eventId;
  Point.find({_id: eventId}, (err: any, racePoints: IPoint[]) => {
    if (err) {
      return res.status(500).send({message: 'false'});
    }
    if (racePoints && racePoints.length !== 0) {
      return res.status(200).send(true);
    } else {
      return res.status(200).send(false);
    }
  });
};

// Retrieve and return all events from the database.
const findAll = (req: Request, res: Response) => {
  Event.find({}, (err: any, events: IEvent[]) => {
    if (err) {
      return res.status(500).send({
        message: err.message ||
          'Some error occurred while retriving events',
      });
    }

    res.status(200).json(events);
  });
};

// Get all events that the user is a participant of
const findFromUsername = (req: Request, res: Response) => {
  const events: IEvent[] = [];
  // Finding all the teams the user is member of
  Team.find({email: req.body.user.email}, (err: any, teams: ITeam[]) => {
    if (err) {
      return res.status(500).send({
        message: err.message ||
          'Some error occurred while retriving teams',
      });
    }
    teams.forEach((team) => {
      Registration.find({_id: team._id}, (err: any,
          registrations: IRegistration[]) => {
        if (err) {
          return res.status(500).send({
            message: err.message ||
              'Some error occurred while retriving eventRegistrations',
          });
        }
        registrations.forEach((registration) => {
          Event.findById(registration.eventId, (err: any, event: IEvent) => {
            if (err) {
              return res.status(500).send({
                message: err.message ||
                  'Some error occurred while retriving eventRegistrations',
              });
            }
            events.push(event);
          });
        });
      });
    });
  });
  res.status(200).send(events);
};
// Find a single event with the given id
const findOne = (req: Request, res: Response) => {
  Event.findOne({_id: req.params.eventId}, (err: any, event: IEvent) => {
    if (err) {
      return res.status(500).send({
        message: 'Error retrieving event with id ' + req.params.eventId,
      });
    }
    if (!event) {
      return res.status(404).send({
        message: 'Event not found with id ' + req.params.eventId,
      });
    }

    res.status(200).send(event);
  });
};

// Finding and updating event with the given id
const update = (req: Request, res: Response) => {
  const newEvent = req.body;
  newEvent.eventId = req.params.eventId;
  Event.updateOne({_id: req.params.eventId},
      newEvent, null, (err: any, event: IEvent | null) => {
        if (err) {
          return res.status(500).send({
            message: err.message ||
          'Error updating bikeRackStation with stationId ' + req.params.eventId,
          });
        }
        if (!event) {
          return res.status(404).send({
            message:
          'BikeRackStation not found with stationId ' + req.params.eventId,
          });
        }
        res.status(202).json(newEvent);
      });
};

// Changes event property "isLive" to true
const startEvent = (req: Request, res: Response) => {
  const start = req.body.actualEventStart;
  const updatedEvent = {isLive: true, actualEventStart: start};
  Event.findOneAndUpdate({_id: req.params.eventId},
      updatedEvent, {new: true}, (err: any, event: any) => {
        if (err) {
          return res.status(500).send({message:
            'Error updating event with eventId ' + req.params.eventId});
        }
        if (!event) {
          return res.status(404).send({message:
            'Event not found with eventId ' + req.params.eventId});
        }

        res.status(202).json(event);
      });
};

// Changes event property "isLive" to false
const stopEvent = (req: Request, res: Response) => {
  const filter = {id: req.params.eventId};
  const update = {isLive: false};
  Event.findOneAndUpdate(filter, update, {
    new: true}, (err: any, event: IEvent | null) => {
    if (err) {
      return res.status(500).send({message:
        'Error updating event with eventId ' + req.params.eventId});
    }
    if (!event) {
      return res.status(404).send({message:
        'Event not found with eventId ' + req.params.eventId});
    } else {
      res.status(202).json(event);
    }
  });
};

// Delete an event with the specified eventId in the request
const remove = async (req: Request, res: Response) => {
  // Declare varibles from request.
  const id = req.params.id;
  const eventId = req.params.eventId;

  // Finding and the deleting the event with the given eventId
  await Event.findOneAndDelete({_id: id}, {}, (err: any,
      event: IEvent | null) => {
    if (err) {
      return res.status(500).send({message:
        'Error deleting event with eventId ' + req.params.eventId});
    }

    // Finding and deleting every EventRegistration with the given eventId
    Registration.deleteMany({_id: eventId}, (err: any) => {
      if (err) {
        return res.status(500).send({message:
          'Error deleting registration with eventId ' + req.params.eventId});
      }
    });
    // Finding and deleting every Point with the given eventId
    Point.deleteMany({_id: eventId}, (err: any) => {
      if (err) {
        return res.status(500).send({message:
          'Error deleting Points with eventId ' + req.params.eventId});
      }

      res.status(202).json(event);
    });
  });
};

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
};
