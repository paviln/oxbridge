import {Request, Response} from 'express';
import Registration, {IRegistration} from '../models/registration';
import Team, {ITeam} from '../models/team';
import Event, {IEvent} from '../models/event';
import User, {IUser} from '../models/user';
import strictTransportSecurity from 'helmet/dist/middlewares/strict-transport-security';
import EmailConfirmation from '../email/email.confirmation';


// Create and Save a new Registration
const create = async (req: Request, res: Response) => {
  await Team.findById(req.body.teamId, (err: any, team: ITeam) => {
    if (err || team) {
      return res.status(404);
    }
  });

  await Event.findById(req.body.eventId, (err: any, event: IEvent) => {
    if (err || event) {
      return res.status(404);
    }
  });
  await User.findById(req.body.eventId, (err: any, user: IUser) => {
    if (err || user) {
      return res.status(404);
    }
  });
  await Registration.create(req.body, (err: any) => {
    if (err) {
      return res.status(404);
    }
  });

  //Send IDs to EmailConfirmation to send a confirmation email to user email. 
  new EmailConfirmation(req.body.eventId, req.body.emailId);
  return res.status(201);
};

// Retrieve and return all Registrations from the database.
const findAll = (req: Request, res: Response) => {
  // Finding all the registrations in the db
  Registration.find({}, (err, registrations) => {
    if (err) {
      return res.status(500).send({message: err.message ||
        'Some error occurred while retriving Registrations'});
    }
    res.status(200).json(registrations);
  });
};

// Retrieve all registrations where the given user is a participant
const findEventRegFromEmail = (req: Request, res: Response) => {
  // Finding team by email in the token
  Team.find({email: req.body.email}, (err, teams) => {
    if (err) {
      return res.status(500).send({message: 'Error retrieving teams'});
    }

    teams.forEach((team) => {
      const filter = {
        _id: req.params.eventId,
        teamId: team._id,
      };
      Registration.find(filter, (err: any, registration: IRegistration) => {
        if (err) {
          return res.status(500).send({
            message: 'Error retrieving registrations ',
          });
        }
        if (registration) {
          return res.status(200).send(registration);
        }
      });
    });
  });
};

/* //Creating an registration
const signUp = (req: Request, res: Response) => {

//Checks that the eventCode is correct
    Event.findOne({ eventCode: req.body.eventCode }, (err, event) => {
        if (err)
            return res.status(500).send({ message: "error retrieving events" });
        if (!event)
            return res.status(404).send({ message: "Wrong eventCode" });

        if (event) {
            //Checks that the team isn't already assigned to the event
            Registration.findOne({ teamId: req.body.teamId, eventId: event._id }, (err: any, registration: IRegistration) => {
                if (err)
                    return res.status(500).send({ message: "error retreiving registrations" });

                if (registration)
                    return res.status(409).send({ message: "team already registered to this event" })

                if (!registration) {

                    // Creating the registration
                    var registration = new Registration(req.body);
                    module.exports.createRegistration(registration, res, function (err, registration) {
                        if (err)
                            return err;

                        return res.status(201).json(registration);
                    });
                }
            });
        }
    });
} */

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
        Team.findOne({_id: registration.teamId}, (err: any, team: ITeam) => {
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

/* //Creating an registration
const addParticipant = (req: Request, res: Response) => {
    //Creates a user if no user corresponding to the given emailUsername found
    User.findOne({ emailUsername: req.body.emailUsername }, (err, user) => {
        if (err)
            return res.status(500).send({ message: "error retrieving user" });
        if (!user) {

            var hashedPassword = bcrypt.hashSync("1234", 10);
            var newUser = new User({ "emailUsername": req.body.emailUsername, "firstname": req.body.firstname, "lastname": req.body.lastname, "password": hashedPassword, "role": "user" });

            newUser.save(function (err) {
                if (err)
                    return res.send(err);
            });
        }

        //Creating a team if a team with the given name and owned by the given user, doesn't exist
        Team.findOne({ emailUsername: req.body.emailUsername, name: req.body.teamName }, { _id: 0, __v: 0 }, function (err, team) {
            if (err)
                return res.status(500).send({ message: "error retrieving team" });
            if (!team) {

                var newTeam = new Team({ "name": req.body.teamName, "emailUsername":req.body.emailUsername });

                Team.findOne({}).sort('-teamId').exec(function (err, lastTeam) {
                    if (err)
                        return res.status(500).send({ message: err.message || "Some error occurred while retriving teams" });
                    if (lastTeam)
                        newTeam.teamId = lastTeam.teamId + 1;
                    else
                        newTeam.teamId = 1;

                    newTeam.save(function (err, savedTeam) {
                        if (err)
                            return res.send(err);
                        var newRegistration = new Registration({"eventId": req.body.eventId, "teamId": savedTeam.teamId, "trackColor": "Yellow", "teamName":req.body.teamName});
                        createRegistration(newRegistration, res);
                    });
                });
            }
            else
        {
            var newRegistration = new Registration({"eventId": req.body.eventId, "teamId": team.teamId, "trackColor": "Yellow", "teamName":req.body.teamName})
            createRegistration(newRegistration, res);
            }
        })
    });
}
 */
// Delete an registration with the specified eventRegId
const remove = (req: Request, res: Response) => {
  // Finding and deleting the registration with the given regId
  const filter = {eventRegId: req.params.eventRegId};
  Registration.findOneAndDelete(filter, null, (err: any,
      registration: IRegistration | null) => {
    if (err) {
      return res.status(500).send({
        message: 'Error deleting registration with eventRegId ' +
        req.params.eventRegId});
    }
    if (!registration) {
      return res.status(404).send({
        message: 'Registration not found with eventRegId ' +
        req.params.eventRegId});
    }
    res.status(202).json(registration);
  });
};

export default {
  create,
  findAll,
  findEventRegFromEmail,
  getParticipants,
  remove,
};
