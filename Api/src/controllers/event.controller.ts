import {Request, Response} from 'express';
import {NotFound} from 'express-http-custom-error';
import Event, {IEvent} from '../models/event';
import Team from '../models/team';
import Point from '../models/point';
import Registration from '../models/registration';

// Create and Save a new Event
const create = async (req: Request, res: Response) => {
  // Saving the new Event in the DB
  const event: IEvent = req.body;
  await event.save();

  res.status(201).json(event);
};

// Checking if event has a route
const hasRoute = async (req: Request, res: Response) => {
  const eventId = req.params.eventId;
  const points = await Point.find({_id: eventId});
  if (points && points.length !== 0) {
    return res.status(200).send(true);
  } else {
    return res.status(200).send(false);
  }
};

// Retrieve and return all events from the database.
const findAll = async (req: Request, res: Response) => {
  const events = await Event.find({});
  if (events == null) throw new NotFound('No events found.');

  res.status(200).json(events);
};

// Get all events that the user is a participant of
const findFromUsername = async (req: Request, res: Response) => {
  let events: IEvent[] = [];
  // Finding all the teams the user is member of
  const teams = await Team.find({email: req.body.user.emailUsername});
  if (teams == null) throw new NotFound('User not member of a team.');

  teams.forEach(async (team) => {
    const teamEvents: IEvent[] = await Event.find({teams: team._id});
    events = events.concat(teamEvents);
  });

  res.status(200).send(events);
};

// Find a single event with the given id
const findOne = async (req: Request, res: Response) => {
  const event = await Event.findOne({_id: req.params.eventId});
  if (!event) {
    throw new NotFound('Event not found with id ' + req.params.eventId);
  }

  res.status(200).send(event);
};

// Finding and updating event with the given id
const update = async (req: Request, res: Response) => {
  const newEvent = req.body;
  newEvent.eventId = req.params.eventId;
  const filter = {_id: req.params.eventId};
  const event = await Event.updateOne(filter, newEvent, null);
  if (!event) throw new NotFound('Event not found with given id ' + filter);

  res.status(202).json(newEvent);
};

// Changes event property "isLive" to true
const startEvent = async (req: Request, res: Response) => {
  const start = req.body.actualEventStart;
  const updatedEvent = {isLive: true, actualEventStart: start};
  const filter = {_id: req.params.eventId};
  const event = await Event.findOneAndUpdate(filter, updatedEvent, {new: true});
  if (!event) throw new NotFound('Event not found with eventId ' + filter);

  res.status(202).json(event);
};

// Changes event property "isLive" to false
const stopEvent = async (req: Request, res: Response) => {
  const filter = {id: req.params.eventId};
  const update = {isLive: false};
  const event = await Event.findOneAndUpdate(filter, update, {new: true});
  if (!event) throw new NotFound('Event not found with eventId ' + filter);

  res.status(202).json(event);
};

// Delete an event with the specified eventId in the request
const remove = async (req: Request, res: Response) => {
  // Declare varibles from request.
  const id = req.params.eventId;

  // Finding and the deleting the event with the given eventId
  const event = await Event.findOneAndDelete({_id: id});
  if (event == null) throw new NotFound('Event not found.');

  await Registration.deleteMany({_id: id});

  // Finding and deleting every Point with the given eventId
  await Point.deleteMany({_id: id});

  res.status(202).json(event);
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
