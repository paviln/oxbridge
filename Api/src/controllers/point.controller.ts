import {Request, Response} from 'express';
import Point, {IPoint} from '../models/point';

// Create new racepoints
const createRoute = async (req: Request, res: Response) => {
  // Deleting all previous racePoints
  const filter = {eventId: req.params.eventId};
  await Point.deleteMany(filter);

  const racePoints: IPoint[] = req.body;

  if (racePoints.length > 0 ) {
    racePoints.forEach((racePoint) => {
      racePoint.save();
    });

    res.status(201).json(racePoints);
  } else {
    return res.status(400).send();
  }
};

// Retrieves all racepoints from an given event
const findAllEventPoints = async (req: Request, res: Response) => {
  const filter = {_id: req.params.id};
  const options = {sort: {racePointNumber: 1}};
  const points = await Point.find(filter, options, null);
  if (!points) throw new Error('No racepoints found for given event.');

  res.status(200).send(points);
};

// Retrieves start and finish racepoints from an given event
const findStartAndFinish = async (req: Request, res: Response) => {
  const filter =
  {
    _id: req.params.id,
    $or: [{type: 'startLine'}, {type: 'finishLine'}],
  };
  const points = await Point.find(filter);
  if (!points) throw new Error('No start and finish points found for event.');

  res.status(200).json(points);
};

export default {
  createRoute,
  findAllEventPoints,
  findStartAndFinish,
};
