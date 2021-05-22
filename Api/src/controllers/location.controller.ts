import {Request, Response} from 'express';
import Location from '../models/location';
import User from '../models/user';
import Event from '../models/event';
import RacePoint from '../models/point';

// Create and Save a new locationRegistration
const create = (req: Request, res: Response) => {
  // Creating the Location
  const locationRegistration = new Location(req.body);

  /*     // Checking if eventReg exists
    Event.findOne({ _id: registration.eventRegId }, function (err, eventReg) {
        if (err)
            return callback(res.status(500).send({ message: err.message ||
            "Some error occurred while retriving event eventRegistration" }));
        if (!eventReg)
            return callback(res.status(404).send({ message:
            "Event with id " + registration.eventRegId + " was not found" }));

        return callback();
    }); */

  locationRegistration.save((err) => {
    if (err) {
      return res.send(err);
    }
  },
  );

  return res.status(201).json(locationRegistration);
};

/* //Updates racePoint number, if the ship has reached new racePoint and calculates the racescore
function CheckRacePoint(registration: IEvent, res: any, callback: any) {
    Event.findOne({ _id: registration.id }, (err: any, eventRegistration: IEvent) => {
        if (err)
            return callback(res.status(500).send({ message: err.message || "Some error occurred while retriving eventRegistrations" }));

        //Checks which racepoint the ship has reached last
        var nextRacePointNumber = 2;
        Location.findOne({ _id: registration.id }, { sort: { 'locationTime': -1 } }, (err, locationRegistration) => {
            if (err)
                return callback(res.status(500).send({ message: err.message || "Some error occurred while retriving locationRegistrations" }));

            if (locationRegistration) {
                nextRacePointNumber = locationRegistration.racePointNumber + 1;
                if (locationRegistration.finishTime != null) {
                    var updatedRegistration = registration;
                    updatedRegistration.racePointNumber = locationRegistration.racePointNumber;
                    updatedRegistration.raceScore = locationRegistration.raceScore;
                    updatedRegistration.finishTime = locationRegistration.finishTime;
                    return callback(updatedRegistration)
                }
            }

            if (eventRegistration) {
                Event.findOne({ eventId: eventRegistration.eventId }, { _id: 0, __v: 0 }, function (err, event) {
                    if (err)
                        return callback(res.status(500).send({ message: err.message || "Some error occurred while retriving events" }));

                    if (event && event.isLive) {

                        //Finds the next racepoint and calculates the ships distance to the racepoint
                        //and calculates the score based on the distance
                        RacePoint.findOne({ eventId: eventRegistration.eventId, racePointNumber: nextRacePointNumber }, { _id: 0, __v: 0 }, function (err, nextRacePoint) {
                            if (err)
                                return callback(res.status(500).send({ message: err.message || "Some error occurred while retriving racepoints" }));
                            if (nextRacePoint) {
                                FindDistance(registration, nextRacePoint, function (distance) {
                                    if (distance < 25) {

                                        if (nextRacePoint.type != "finishLine") {
                                            RacePoint.findOne({ eventId: eventRegistration.eventId, racePointNumber: nextRacePoint.racePointNumber + 1 }, { _id: 0, __v: 0 }, function (err, newNextRacePoint) {
                                                if (err)
                                                    return callback(res.status(500).send({ message: err.message || "Some error occurred while retriving racepoints" }));


                                                if (newNextRacePoint) {
                                                    FindDistance(registration, newNextRacePoint, function (nextPointDistance) {
                                                        distance = nextPointDistance;

                                                        var updatedRegistration = registration;
                                                        updatedRegistration.racePointNumber = nextRacePointNumber;
                                                        updatedRegistration.raceScore = ((nextRacePointNumber) * 10) + ((nextRacePointNumber) / distance);
                                                        return callback(updatedRegistration)
                                                    });
                                                }

                                            })
                                        } else {
                                            var updatedRegistration = registration;
                                            updatedRegistration.racePointNumber = nextRacePointNumber;
                                            updatedRegistration.finishTime = registration.locationTime
                                            var ticks = ((registration.locationTime.getTime() * 10000) + 621355968000000000);
                                            updatedRegistration.raceScore = (1000000000000000000 - ticks) / 1000000000000
                                            return callback(updatedRegistration);
                                        }
                                    } else {
                                        var updatedRegistration = registration;
                                        updatedRegistration.racePointNumber = nextRacePointNumber - 1;
                                        updatedRegistration.raceScore = ((nextRacePointNumber - 1) * 10) + ((nextRacePointNumber - 1) / distance);
                                        return callback(updatedRegistration)
                                    }
                                });
                            } else {
                                var updatedRegistration = registration;
                                updatedRegistration.racePointNumber = 1;
                                updatedRegistration.raceScore = 0;
                                return callback(updatedRegistration)
                            }
                        });
                    } else {
                        var updatedRegistration = registration;
                        updatedRegistration.racePointNumber = 1;
                        updatedRegistration.raceScore = 0;
                        return callback(updatedRegistration)
                    }
                });
            }
        });
    });
} */
/*
//Finds the ships distance to the racepoint
function FindDistance(registration, racePoint, callback) {
    var checkPoint1 = {};
    var checkPoint2 = {};

    checkPoint1.longtitude = racePoint.firstLongtitude;
    checkPoint1.latitude = racePoint.firstLatitude;
    checkPoint2.longtitude = racePoint.secondLongtitude;
    checkPoint2.latitude = racePoint.secondLatitude;

    var AB = CalculateDistance(checkPoint1, checkPoint2);
    var BC = CalculateDistance(checkPoint2, registration);
    var AC = CalculateDistance(checkPoint1, registration);

    var P = (AB + BC + AC) / 2;
    var S = Math.sqrt(P * (P - AC) * (P - AB) * (P - AC));

    var result = 2 * S / AB;
    return callback(result)
}

//Calculates the closets distance from the ship to the checkpoint
function CalculateDistance(first, second) {
    var R = 6371e3; // metres
    var φ1 = first.latitude * Math.PI / 180; // φ, λ in radians
    var φ2 = second.latitude * Math.PI / 180;
    var Δφ = (second.latitude - first.latitude) * Math.PI / 180;
    var Δλ = (second.longtitude - first.longtitude) * Math.PI / 180;

    var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    var d = R * c;

    return d;
}

//Retrieve the latest locationRegistrations on all ships in specific event
var pending = 0
const getLive = (req: Request, res: Response) => {
    Event.find({ _id: req.params.eventId }, (err, eventRegistrations) => {
        if (err) {
            return res.status(500).send({ message: err.message || "Some error occurred while retriving eventRegistrations" });
        }

        var fewRegistrations = [];
        eventRegistrations.forEach(eventRegistration => {
            pending++

            Location.find({ eventRegId: eventRegistration.eventRegId }, { _id: 0, __v: 0 }, { sort: { 'locationTime': -1 }, limit: 20 }, function (err, locationRegistration) {
                pending--;
                if (err) {
                    return res.status(500).send({ message: err.message || "Some error occurred while retriving locationRegistrations" });
                }
                if (locationRegistration.length != 0) {
                    boatLocations = { "locationsRegistrations": locationRegistration, "color": eventRegistration.trackColor, "shipId": eventRegistration.shipId, "teamName": eventRegistration.teamName }
                    fewRegistrations.push(boatLocations);

                }
                if (pending == 0) {
                    if (fewRegistrations.length != 0) {
                        if (fewRegistrations[0].locationsRegistrations[0].raceScore != 0) {
                            fewRegistrations.sort((a, b) => (a.locationsRegistrations[0].raceScore >= b.locationsRegistrations[0].raceScore) ? -1 : 1)

                            for (i = 0; i < fewRegistrations.length; i++) {
                                fewRegistrations[i].placement = i + 1;
                            }
                        } else {
                            fewRegistrations.sort((a, b) => (a.shipId > b.shipId) ? 1 : -1)

                        }
                    }
                    return res.status(200).json(fewRegistrations);
                }
            });
        });
    });
}; */

/* //Retrive scoreboard from event
const getScoreboard = (req:Request, res: Response) => {
    var pending = 0;
    Event.find({ _id: req.params.eventId }, (err, eventRegistrations) => {
        if (err)
            return res.status(500).send({ message: err.message || "Some error occurred while retriving eventRegistrations" })
        if (eventRegistrations.length !== 0) {
            var scores = [];
            eventRegistrations.forEach(eventReg => {
                pending++;
                Location.find({ eventRegId: eventReg.eventRegId }, { _id: 0, __v: 0 }, { sort: { 'locationTime': -1 }, limit: 1 }, function (err, locationRegistration) {
                    if (err)
                        return res.status(500).send({ message: err.message || "Some error occurred while retriving locationRegistrations" });
                    if (locationRegistration.length !== 0) {
                        Ship.findOne({ shipId: eventReg.shipId }, { _id: 0, __v: 0 }, function (err, ship) {
                            if (err)
                                return res.status(500).send({ message: err.message || "Some error occurred while retriving ships" });

                            User.findOne({ emailUsername: ship.emailUsername }, { _id: 0, __v: 0 }, function (err, user) {
                                pending--;
                                if (err)
                                    return res.status(500).send({ message: err.message || "Some error occurred while retriving users" });
                                if (user) {
                                    score = { "locationsRegistrations": locationRegistration, "color": eventReg.trackColor, "shipId": eventReg.shipId, "shipName": ship.name, "teamName": eventReg.teamName, "owner": user.firstname + " " + user.lastname };
                                    scores.push(score);
                                }
                                if (pending === 0) {
                                    if (scores.length != 0) {
                                        if (scores[0].locationsRegistrations[0].raceScore != 0) {
                                            scores.sort((a, b) => (a.locationsRegistrations[0].raceScore >= b.locationsRegistrations[0].raceScore) ? -1 : 1)

                                            for (i = 0; i < scores.length; i++) {
                                                scores[i].placement = i + 1;
                                            }
                                        }
                                        else {
                                            scores.sort((a, b) => (a.shipId > b.shipId) ? 1 : -1)
                                        }
                                    }
                                    return res.status(200).json(scores);
                                }
                            });
                        })
                    }
                    else
                        pending--;
                })
            })
            if (pending === 0)
                return res.status(200).send(scores);
        }
        else
            return res.status(200).send({});
    })
} */


/* //Retrieve all locationRegistrations from an event
const getReplay = (req: Request, res: Response) => {
    Event.find({ _id: req.params.eventId }, (err, eventRegistrations) => {
        if (err) {
            return res.status(500).send({ message: err.message || "Some error occurred while retriving eventRegistrations" })
        }

        if (eventRegistrations.length !== 0) {
            var shipLocations = [];
            eventRegistrations.forEach(eventRegistration => {
                pending++
                Location.find({ _id: eventRegistration.id }, { sort: { 'locationTime': 1 } }, (err, locationRegistrations) => {
                    pending--
                    if (err)
                        return res.status(500).send({ message: err.message || "Some error occurred while retriving registrations" })
                    if (locationRegistrations) shipLocation{
                        var shipLocation = { "locationsRegistrations": locationRegistrations, "color": eventRegistration.trackColor, "shipId": eventRegistration.shipId, "teamName": eventRegistration.teamName }
                        shipLocations.push()
                    }
                    if (pending === 0) {
                        return res.status(200).send(shipLocations)
                    }
                });
            });
        } else {
            return res.status(200).send({})
        }
    });
}; */

// Deleting all locationRegistration with an given eventRegId
const deleteFromEventRegId = (req: Request, res: Response) => {
  // Finding and deleting the locationRegistrations with the given eventRegId
  Location.deleteMany({_id: req.params.eventId}, (err: any) => {
    if (err) {
      return res.status(500).send({
        message: 'Error deleting locationRegistrations with eventRegId ' +
        req.params.regId});
    }

    res.status(202);
  });
};

export default {
  create,
  deleteFromEventRegId,
};
