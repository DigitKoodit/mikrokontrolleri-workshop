import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

import { assertReading } from './util';
import { initializeDB, insertReading, getSensors, getReadings } from './dbUtils';

const app = express();
app.use(bodyParser.json());
initializeDB();

/**
 * POST /api/newreading
 * Send a new reading from the sensor to the server.
 */
app.post('/api/newreading', (req: Request, res: Response) => {
  const reading: NewReading = req.body;
  console.log('received new reading:', reading);

  // TODO: switch to TypeScript type guard
  try {
    assertReading(reading);
  }
  catch (error) {
    return res.status(400).send(error); // HTTP 400 Bad Request
  }

  insertReading(reading);

  res.send(reading);
});

/**
 * GET /api/getsensors
 * List sensor data.
 */
app.get('/api/getsensors', (req: Request, res: Response) => {
  console.log('Received getsensors request');
  res.send(getSensors());
});

/**
 * GET /api/getreadings
 * List reading data.
 */
app.get('/api/getreadings', (req: Request, res: Response) => {
  console.log('Received getreadings request');
  res.send(getReadings());
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
