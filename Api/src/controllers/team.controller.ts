import Team, {ITeam} from '../models/team';
import Event from '../models/event';
import {Request, Response} from 'express';
import Registration from '../models/registration';

// Create and Save a new team
const create = async (req: Request, res: Response) => {
  const team: ITeam = req.body;
  try {
    await team.save();
    res.status(201).json(team);
  } catch (error) {
    return res.status(500).json({message: 'Internal server error.'});
  }
};

// Retrieving all user teams
const findTeams = async (req: Request, res: Response) => {
  await Team.find({email: req.body.user.email}, (err, teams) => {
    if (err) {
      return res.status(500).send(
          {message: err.message || 'Some error occurred while retriving team'});
    }

    res.status(200).send(teams);
  });
};

// Retrieve and return all teams
const findAll = async (req: Request, res: Response) => {
  await Team.find({}, (err, teams) => {
    if (err) {
      return res.status(404).send({
        message: err.message || 'Some error occurred while retriving teams'});
    }
    res.status(200).json(teams);
  });
};

// Find a single team with the given teamId
const findOne = async (req: Request, res: Response) => {
  await Team.findOne({shipId: req.params.teamId}, (err: any, team: ITeam) => {
    if (err) {
      return res.status(404).send({
        message: 'Error retrieving team with teamId ' + req.params.teamId});
    }
    res.status(200).send({'name': team.name, 'teamId': team.id});
  });
};

// Find all teams registered to an specific event.
const findFromEventId = async (req: Request, res: Response) => {
  const teams: ITeam[] = [];
  try {
    // Find specific event by id.
    const event = await Event.findById({_id: req.params.eventId});
    if (!event) return res.status(404).json({message: 'Event not found!'});

    // Find all registrations of the event.
    const registrations = await Registration.find({eventId: event.id});
    if (!registrations) {
      return res.status(404).json({message: 'Registration not found!'});
    }

    // Find the teams of the registrations.
    registrations.forEach((registration) => {
      Team.findById(registration.teamId, (err: any, team: ITeam) => {
        teams.push(team);
      });
    });

    res.status(200).json(teams);
  } catch (error) {
    return res.status(500).json({message: 'Internal server error.'});
  }
};

// Finding and updating the team with the given teamId
const update = (req: Request, res: Response) => {
  const newTeam: ITeam = new Team(req.body);
  Team.findOneAndUpdate({_id: req.params.teamId}, newTeam, null, (err: any) => {
    if (err) {
      return res.status(500).send({
        message: 'Error updating team with teamId ' + req.params.teamId});
    }
    res.status(202).json(newTeam);
  });
};

// Delete a team with the specified teamId in the request
const remove = (req: Request, res: Response) => {
  const filter = {_id: req.params.teamId};
  Team.findOneAndDelete(filter, null, (err: any, team: ITeam | null) => {
    if (err) {
      return res.status(500).send({
        message: 'Error deleting ship with shipId ' + req.params.shipId});
    }
    res.status(202).json(team);
  });
};

export default {
  create,
  findTeams,
  findAll,
  findOne,
  findFromEventId,
  update,
  remove,
};
