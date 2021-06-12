import EventRegistration, { IEventRegistration } from '../models/eventRegistration';
import Ship, { IShip } from '../models/ship';
import Event, { IEvent } from '../models/event';
import User, { IUser } from '../models/user';

import { Request, Response } from 'express';
import EmailConfirmation from '../email/email.confirmation';
var bcrypt = require('bcryptjs');

// Create and Save a new EventRegistration
const create = (req: Request, res: Response) => {


  // Creating the eventRegistration
  var registration = new EventRegistration(req.body);
  createRegistration(registration, res, function (err: any, registration: IEventRegistration) {
    if (err)
      return err;

    return res.status(201).json(registration);
  });

};

// Checks that all foreignkeys are valid. Creates and save a new EventRegistration. Returns response
const createRegistration = (newRegistration: IEventRegistration, res: Response, callback: any) => {

  validateForeignKeys(newRegistration, res, function (err: any) {
    if (err)
      return callback(err);

    // Finding next eventRegId
    EventRegistration.findOne({}).sort('-eventRegId').exec(function (err, lastEventRegistration) {
      if (err)
        return callback(res.status(500).send({ message: err.message || "Some error occurred while retriving eventRegistrations" }));
      if (lastEventRegistration)
        newRegistration.eventRegId = lastEventRegistration.eventRegId + 1;
      else
        newRegistration.eventRegId = 1;

      newRegistration.save(function (err) {
        if (err)
          return callback(res.send(err));
        return callback(null, newRegistration);
      });
    });
  })
};

// Retrieve and return all EventRegistrations from the database.
const findAll = (req: Request, res: Response) => {

  // Finding all the registrations in the db
  EventRegistration.find({}, { _id: 0, __v: 0 }, null, function (err, eventRegistrations) {
    if (err)
      return res.status(500).send({ message: err.message || "Some error occurred while retriving EventRegistrations" });

    res.status(200).json(eventRegistrations);
  });
};

//Retrieve all eventRegistrations where the given user is a participant
var pending = 0;
const findEventRegFromUsername = (req: any, res: Response) => {

  // Finding ship by emailUsername in the token
  Ship.find({ emailUsername: req.user.id }, { _id: 0, __v: 0 }, null, function (err, ships) {
    if (err)
      return res.status(500).send({ message: "Error retrieving ships" });

    ships.forEach(ship => {
      pending++;
      EventRegistration.find({ eventId: +req.params.eventId, shipId: ship.shipId }, { _id: 0, __v: 0 }, null, function (err, eventRegistration) {
        pending--;
        if (err)
          return res.status(500).send({ message: "Error retrieving eventRegistrations " })
        if (eventRegistration)
          return res.status(200).send(eventRegistration);
      });
    });
  });
};

//Creating an eventRegistration
const signUp = (req: Request, res: Response) => {
  //Checks that the eventCode is correct
  Event.findOne({ eventCode: req.body.eventCode }, { _id: 0, __v: 0 }, null, function (err, event) {
    if (err)
      return res.status(500).send({ message: "error retrieving events" });
    if (!event)
      return res.status(404).send({ message: "Wrong eventCode" });

    if (event) {
      //Checks that the ship isn't already assigned to the event
      EventRegistration.findOne({ shipId: req.body.shipId, eventId: event.eventId }, { _id: 0, __v: 0 }, null, function (err, eventRegistration) {
        if (err)
          return res.status(500).send({ message: "error retreiving eventRegistrations" });

        if (eventRegistration)
          return res.status(409).send({ message: "ship already registered to this event" })

        if (!eventRegistration) {

          // Creating the eventRegistration
          var registration = new EventRegistration(req.body);
          registration.eventId = event.eventId;
          
          createRegistration(registration, res, function (err: any, registration: IEventRegistration) {
            if (err)
              return err;
            console.log("hey");
           
            new EmailConfirmation(registration.eventId, registration.shipId);
            return res.status(201).json(registration);
          });
        }
      })
    }
  })
}

//Retrieve all participants of the given event
var pending = 0;
const getParticipants = (req: Request, res: Response) => {

  var participants: any = [];
  EventRegistration.find({ eventId: +req.params.eventId }, { _id: 0, __v: 0 }, null, function (err, eventRegs) {
    if (err)
      return res.status(500).send({ message: "Error retrieving participants" });
    if (!eventRegs || eventRegs.length === 0)
      return res.status(404).send({ message: "No participants found" });

    if (eventRegs.length !== 0) {
      eventRegs.forEach(eventRegistration => {
        pending++;

        Ship.findOne({ shipId: eventRegistration.shipId }, { _id: 0, __v: 0 }, null, function (err, ship) {
          if (err)
            return res.status(500).send({ message: "error retrieving ship" });
          if (!ship)
            return res.status(404).send({ message: "Ship not found" });

          else if (ship) {
            User.findOne({ emailUsername: ship.emailUsername }, { _id: 0, __v: 0 }, null, function (err, user) {
              pending--;
              if (err)
                return res.status(500).send({ message: "Error retrieving user" });
              if (!user)
                return res.status(404).send({ message: "User not found" });

              if (user) {
                let participant = {
                  "firstname": user.firstname,
                  "lastname": user.lastname,
                  "shipName": ship.name,
                  "teamName": eventRegistration.teamName,
                  "emailUsername": user.emailUsername,
                  "eventRegId": eventRegistration.eventRegId
                }
                participants.push(participant);

                if (pending === 0) {
                  return res.status(200).json(participants);
                }
              }
            })
          }
        })
      });
    }
  })
}

//Creating an eventRegistration
const addParticipant = (req: Request, res: Response) => {

  //Creates a user if no user corresponding to the given emailUsername found
  User.findOne({ emailUsername: req.body.emailUsername }, { _id: 0, __v: 0 }, null, function (err, user) {
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

    //Creating a ship if a ship with the given name and owned by the given user, doesn't exist
    Ship.findOne({ emailUsername: req.body.emailUsername, name: req.body.shipName }, { _id: 0, __v: 0 }, null, function (err, ship) {
      if (err)
        return res.status(500).send({ message: "error retrieving ship" });
      if (!ship) {

        var newShip = new Ship({ "name": req.body.shipName, "emailUsername": req.body.emailUsername });

        Ship.findOne({}).sort('-shipId').exec(function (err, lastShip) {
          if (err)
            return res.status(500).send({ message: err.message || "Some error occurred while retriving ships" });
          if (lastShip)
            newShip.shipId = lastShip.shipId + 1;
          else
            newShip.shipId = 1;

          newShip.save(function (err, savedShip) {
            if (err)
              return res.send(err);
            var newEventRegistration = new EventRegistration({ "eventId": req.body.eventId, "shipId": savedShip.shipId, "trackColor": "Yellow", "teamName": req.body.teamName });
            createRegistration(newEventRegistration, res, function (err: any, registration: IEventRegistration) {
              if (err)
                return err;

              return res.status(201).json(registration);
            });
          });
        });
      }
      else {
        var newEventRegistration = new EventRegistration({ "eventId": req.body.eventId, "shipId": ship.shipId, "trackColor": "Yellow", "teamName": req.body.teamName })
        createRegistration(newEventRegistration, res, function (err: any, registration: IEventRegistration) {
          if (err)
            return err;
          console.log(ship.shipId);
          new EmailConfirmation(ship.shipId, req.body.eventId);
          return res.status(201).json(registration);
        });
      }
    })
  });
}

//Updating information on a given participant
const updateParticipant = (req: Request, res: Response) => {


  EventRegistration.findOneAndUpdate({ eventRegId: +req.params.eventRegId }, req.body, null, function (err, eventReg, res) {
    if (err)
      return res.status(500).send({ message: "Error updating eventRegistration with eventRegId " + req.params.eventRegId });
    if (eventReg) {
      Ship.findOneAndUpdate({ shipId: eventReg.shipId }, req.body, null, function (err, ship, res) {
        if (err)
          return res.status(500).send({ message: "Error updating ship with shipId " + eventReg.shipId });
        if (ship) {
          User.findOneAndUpdate({ emailUsername: ship.emailUsername }, req.body, null, function (err, user, res) {
            if (err)
              return res.status(500).send({ message: "Error updating user with emailUsername " + ship.emailUsername });
            if (!user)
              return res.status(404).send({ message: "User not found with emailUsername " + ship.emailUsername });
            else
              return res.status(200).send({ updated: "true" })
          })
        }
        else
          return res.status(404).send({ message: "Ship not found with shipId " + eventReg.shipId });
      });
    }
    else
      return res.status(404).send({ message: "EventRegistration not found with eventRegId " + req.params.eventRegId });
  })
}

// Delete an eventRegistration with the specified eventRegId
const remove = (req: Request, res: Response) => {
  // Finding and deleting the registration with the given regId
  EventRegistration.findOneAndDelete({ eventRegId: +req.params.eventRegId }, null, function (err, eventRegistration) {
    if (err)
      return res.status(500).send({ message: "Error deleting eventRegistration with eventRegId " + req.params.eventRegId });
    if (!eventRegistration)
      return res.status(404).send({ message: "EventRegistration not found with eventRegId " + req.params.eventRegId });
    res.status(202).json(eventRegistration);
  });
};

//Validator for all eventRegistrations foreignkeys
function validateForeignKeys(registration: any, res: Response, callback: any) {
  // Checking if ship exists
  Ship.findOne({ shipId: registration.shipId }, function (err: any, ship: IShip) {
    if (err)
      return callback(res.status(500).send({ message: err.message || "Some error occurred while retriving ships" }));
    if (!ship)
      return callback(res.status(404).send({ message: "Ship with id " + registration.shipId + " was not found" }));

    // Checking if event exists
    Event.findOne({ eventId: registration.eventId }, function (err: any, event: IEvent) {
      if (err)
        return callback(res.status(500).send({ message: err.message || "Some error occurred while retriving races" }));
      if (!event)
        return callback(res.status(404).send({ message: "Race with id " + registration.eventId + " was not found" }));

      return callback();
    });
  });
}

export default {
  create,
  findAll,
  findEventRegFromUsername,
  signUp,
  getParticipants,
  addParticipant,
  updateParticipant,
  remove,
}