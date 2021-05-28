import Ship, { IShip } from '../models/ship';
import EventRegistrations, { IEventRegistration } from '../models/eventRegistration';
import { Request, Response } from 'express';

// Create and Save a new ship
const create = (req: Request, res: Response) => {

  var ship = new Ship(req.body);
  // Finding next shipId
  Ship.findOne({}).sort('-shipId').exec(function (err: any, lastShip: IShip | null) {
    if (err)
      return res.status(500).send({ message: err.message || "Some error occurred while retriving ships" });
    if (lastShip)
      ship.shipId = lastShip.shipId + 1;
    else
      ship.shipId = 1;

    // Saving the new ship in the DB
    ship.save(function (err: any) {
      if (err)
        return res.send(err);
      res.status(201).json(ship);
    });
  });
};

//Retrieving all user ships
const findMyShips = (req: any, res: Response) => {

  Ship.find({ emailUsername: req.user.id }, { _id: 0, __v: 0 }, null, function (err: any, ships: IShip[]) {
    if (err)
      return res.status(500).send({ message: err.message || "Some error occurred while retriving ships" });

    res.status(200).send(ships);
  });
}

// Retrieve and return all ships
const findAll = (req: Request, res: Response) => {
  // Finding all ships in the db
  Ship.find({}, { _id: 0, __v: 0 }, null, function (err: any, ships: IShip[]) {
    if (err)
      return res.status(500).send({ message: err.message || "Some error occurred while retriving ships" });

    res.status(200).json(ships);
  });
};

// Find a single ship with the given shipId
const findOne = (req: Request, res: Response) => {
  Ship.findOne({ shipId: +req.params.shipId }, { _id: 0, __v: 0 }, null, function (err: any, ship: IShip | null) {
    if (err)
      return res.status(500).send({ message: "Error retrieving ship with shipId " + req.params.shipId });
    if (!ship)
      return res.status(404).send({ message: "Ship with id " + req.params.shipId + " was not found" });

    res.status(200).send({ "name": ship.name, "shipId": ship.shipId });
  });
};

//Find all ships registered to an specific event
var pending = 0
const findFromEventId = (req: Request, res: Response) => {
  EventRegistrations.find({ eventId: +req.params.eventId }, { _id: 0, __v: 0 }, null, function (err: any, eventRegistrations: IEventRegistration[] | null) {
    if (err) {
      return res.status(500).send({ message: err.message || "Some error occurred while retriving bikeRacks" });
    }
    if (!eventRegistrations) {
      return res.status(404).send({ message: "Event registrarions with id " + req.params.eventId + " was not found." });
    }
    if (eventRegistrations.length != 0) {

      var ships: any = [];
      eventRegistrations.forEach(eventRegistration => {
        pending++;

        Ship.findOne({ shipId: eventRegistration.shipId }, { _id: 0, __v: 0 }, null, function (err: any, ship: IShip | null) {
          pending--
          if (err) {
            return res.status(500).send({ message: err.message || "Some error occurred while retriving bikeRacks" });
          }
          if (ship) {
            ships.push({ "shipId": ship.shipId, "name": ship.name, "teamName": eventRegistration.teamName });
          }
          if (pending === 0) {
            res.status(200).json(ships);
          }
        });
      });
    } else {
      res.status(200).json({});
    }
  });
};


// Update a ship identified by the shipId
const update = (req: Request, res: Response) => {
  // Finding and updating the ship with the given shipId
  var newShip = new Ship(req.body);
  Ship.findOneAndUpdate({ shipId: +req.params.shipId }, newShip, null, function (err: any, ship: IShip | null) {
    if (err)
      return res.status(500).send({ message: "Error updating ship with shipId " + req.params.shipId });
    if (!ship)
      return res.status(404).send({ message: "Ship not found with shipId " + req.params.shipId });

    res.status(202).json(ship);
  });
};

// Delete a ship with the specified shipId in the request
const remove = (req: Request, res: Response) => {
  // Finding and deleting the ship with the given shipId
  Ship.findOneAndDelete({ shipId: +req.params.shipId }, null, function (err: any, ship: IShip | null) {
    if (err)
      return res.status(500).send({ message: "Error deleting ship with shipId " + req.params.shipId });
    if (!ship)
      return res.status(404).send({ message: "Ship not found with shipId " + req.params.shipId });

    res.status(202).json(ship);
  });
};

export default {
  create,
  findMyShips,
  findAll,
  findOne,
  findFromEventId,
  update,
  remove,
}