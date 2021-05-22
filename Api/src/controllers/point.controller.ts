import {Request, Response} from 'express';
import Point, {IPoint} from '../models/point';

// Create new racepoints
const createRoute = (req: Request, res: Response) => {
  // Deleting all previous racePoints
  const filter = {eventId: req.params.eventId};
  Point.deleteMany(filter, (err: any) => {
    if (err) {
      return res.status(500).send({
        message: err.message ||
        'Some error occurred while deleteing racePoints'});
    }

    const racePoints: IPoint[] = req.body;

    if (racePoints.length > 0 ) {
      racePoints.forEach((racePoint) => {
        racePoint.save((err) => {
          if (err) {
            return res.send(err);
          }
        });
      });

      res.status(201).json(racePoints);
    } else {
      return res.status(400).send();
    }
  });
};

// Retrieves all racepoints from an given event
const findAllEventPoints = (req: Request, res: Response) => {
  const filter = {_id: req.params.id};
  const options = {sort: {racePointNumber: 1}};
  Point.find(filter, options, null, (err: any,
      racePoints: IPoint[] | null) => {
    if (err) {
      return res.status(500).send({
        message: err.message ||
        'Some error occurred while retriving racepoints'});
    }
    return res.status(200).send(racePoints);
  });
};

// Retrieves start and finish racepoints from an given event
const findStartAndFinish = (req: Request, res: Response) => {
  const filter =
  {
    _id: req.params.id,
    $or: [{type: 'startLine'}, {type: 'finishLine'}],
  };
  Point.find(filter, (err: any, racePoints: IPoint[]) => {
    if (err) {
      return res.status(500).send({
        message: err.message ||
        'Some error occurred while retriving racepoints'});
    }
    res.status(200).json(racePoints);
  });
};

export default {
  createRoute,
  findAllEventPoints,
  findStartAndFinish,
};
