import Team, {ITeam} from '../models/team';
import {Request, Response} from 'express';
import Registration from '../models/registration';

// Create and Save a new team
const create = async (req: Request, res: Response) => {
  const team: ITeam = req.body;
  const savedTeam = await team.save();

  res.status(201).json(savedTeam);
};

// Retrieving all user teams
const findTeams = async (req: Request, res: Response) => {
  const teams = await Team.find({email: req.body.user.email});

  res.status(200).send(teams);
};

// Retrieve and return all teams
const findAll = async (req: Request, res: Response) => {
  const teams = await Team.find({});

  res.status(200).json(teams);
};

// Find a single team with the given teamId
const findOne = async (req: Request, res: Response) => {
  const team = await Team.findOne({_id: req.params.shipId});
  if (!team) throw new Error('No team found with given id.');

  res.status(200).send({'name': team.name, 'teamId': team.id});
};

// Find all teams registered to an specific event.
const findFromEventId = async (req: Request, res: Response) => {
  const registrations = await Registration.find({_id: req.params.eventId});
  if (registrations.length == 0) {
    throw new Error('Event does not have any registrations.');
  }
  const teams: any = [];
  registrations.forEach(async (eventRegistration) => {
    const team = await Team.findOne({shipId: eventRegistration.shipId});
    if (team) {
      teams.push({
        '_id': team._id,
        'name': team.name,
        'teamName': eventRegistration.teamName,
      });
    }
  });
  res.status(200).json(teams);
};

// Finding and updating the team with the given teamId
const update = async (req: Request, res: Response) => {
  const team: ITeam = new Team(req.body);
  const filter = {_id: req.params.teamId};
  const updatedTeam = await Team.findOneAndUpdate(filter, team, null);

  res.status(202).json(updatedTeam);
};

// Delete a team with the specified teamId in the request
const remove = async (req: Request, res: Response) => {
  const filter = {_id: req.params.teamId};
  const team = await Team.findOneAndDelete(filter, null);
  if (!team) throw new Error('No team found with givenid ' + req.params.teamId);

  res.status(202).json(team);
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
