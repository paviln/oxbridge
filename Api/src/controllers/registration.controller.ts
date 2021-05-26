import {Request, Response} from 'express';
import bcrypt from 'bcrypt';
import Registration, {IRegistration} from '../models/registration.js';
import Team, {ITeam} from '../models/team.js';
import Event from '../models/event.js';
import User from '../models/user.js';

// Create and Save a new Registration
const create = async (req: Request, res: Response) => {
  const team = await Team.findById(req.body.teamId);
  if (!team) throw new Error('No team found with given id.');

  const event = await Event.findById(req.body.eventId);
  if (!event) throw new Error('No event found with given id.');

  const result = await Registration.create(req.body);

  return res.status(201).json(result);
};

// Retrieve and return all Registrations from the database.
const findAll = async (req: Request, res: Response) => {
  // Finding all the registrations in the db
  const registrations = await Registration.find({});

  res.status(200).json(registrations);
};

// Checks that all foreignkeys are valid.
const createRegistration = async (newRegistration: any) => {
  await validateForeignKeys(newRegistration);

  return await newRegistration.save();
};

// Retrieve all registrations where the given user is a participant
const findEventRegFromEmail = async (req: Request, res: Response) => {
  let registrations: IRegistration[] = [];
  // Finding teams by email in the token
  const teams = await Team.find({email: req.body.emailUsername});

  teams.forEach(async (team) => {
    const filter = {
      _id: req.params.eventId,
      teamId: team._id,
    };
    registrations = registrations.concat(await Registration.find(filter));
  });

  return res.status(200).send(registrations);
};

// Creating an registration
const signUp = async (req: Request, res: Response) => {
// Checks that the eventCode is correct
  const event = await Event.findOne({eventCode: req.body.eventCode});
  if (!event) throw new Error('Wrong eventCode');

  // Checks that the team isn't already assigned to the event
  const filter = {teamId: req.body.teamId, eventId: event._id};
  const registration = await Registration.findOne(filter);
  if (registration) throw new Error('Team already registered to this event.');


  if (!registration) {
    // Creating the registration
    const createdRegistration = new Registration(req.body);
    createRegistration(createdRegistration);

    return res.status(201).json(createdRegistration);
  }
};

// Retrieve all participants of the given event
const getParticipants = (req: Request, res: Response) => {
  const filter = {_id: req.params.id};
  Registration.find(filter, (err: any, registrations: IRegistration[]) => {
    if (err) {
      return res.status(500).send({message: 'Error retrieving participants'});
    }
    if (!registrations || registrations.length === 0) {
      return res.status(404).send({message: 'No participants found'});
    }

    if (registrations.length > 0) {
      registrations.forEach((registration) => {
        Team.findOne({_id: registration._id}, (err: any, team: ITeam) => {
          if (err) {
            return res.status(500).send({message: 'error retrieving team'});
          }
          if (!team) {
            return res.status(404).send({message: 'Team not found'});
          }

          return res.status(200).json(team.members);
        });
      });
    }
  });
};

// Creating an registration
const addParticipant = async (req: Request, res: Response) => {
  // Creates a user if no user corresponding to the given emailUsername found
  const user = await User.findOne({emailUsername: req.body.emailUsername});
  if (user) throw new Error('User allready exists.');

  const hashedPassword = bcrypt.hashSync('1234', 10);
  const newUser = new User({
    'email': req.body.emailUsername,
    'firstname': req.body.firstname,
    'lastname': req.body.lastname,
    'password': hashedPassword,
    'role': 'user',
  });

  newUser.save();

  // Creating a team if a team with the given
  // name and owned by the given user, doesn't exist
  const team = await Team.findOne({
    email: req.body.emailUsername,
    name: req.body.teamName},
  );

  if (!team) {
    const newTeam = new Team({
      'name': req.body.teamName,
      'email': req.body.emailUsername,
    });
    newTeam.save(function(err, savedTeam) {
      if (err) {
        return res.send(err);
      }
      const newRegistration = new Registration({
        'eventId': req.body.eventId,
        'teamId': savedTeam._id,
        'trackColor': 'Yellow',
        'teamName': req.body.teamName,
      });
      createRegistration(newRegistration);
    });
  } else {
    const newRegistration = new Registration({
      'eventId': req.body.eventId,
      'teamId': team._id,
      'trackColor': 'Yellow',
      'teamName': req.body.teamName,
    });
    createRegistration(newRegistration);
  }
};

// Delete an registration with the specified eventRegId
const remove = async (req: Request, res: Response) => {
  // Finding and deleting the registration with the given regId
  const filter = {_id: req.params.eventRegId};
  const registration = await Registration.findOneAndDelete(filter, null);
  if (!registration) {
    throw new Error('Registration not found with eventRegId ' +
    req.params.eventRegId);
  }
  res.status(202).json(registration);
};

// Validator for all registrations foreignkeys
const validateForeignKeys = async (registration: any) => {
  // Checking if team exists
  const team = await Team.findOne({_id: registration.shipId});
  if (!team) {
    throw new Error('Ship with id ' + registration.shipId + ' was not found');
  }
  // Checking if event exists
  const event = await Event.findOne({eventId: registration.eventId});
  if (!event) {
    throw new Error('Race with id ' + registration.eventId + ' was not found.');
  }
};

export default {
  create,
  findAll,
  findEventRegFromEmail,
  signUp,
  getParticipants,
  addParticipant,
  remove,
};
