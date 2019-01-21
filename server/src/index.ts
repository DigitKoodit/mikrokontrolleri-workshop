import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

import { assertReading } from './util';
import { initializeDB, insertReading, getSensors, getReadings } from './dbUtils';

const app = express();
app.use(bodyParser.json());
initializeDB();

app.post('/api/newreading', (req: Request, res: Response) => {
  const reading: Reading = req.body;
  console.log('received new reading:', reading);

  try {
    assertReading(reading);
  }
  catch (error) {
    return res.status(400).send(error); // HTTP 400 Bad Request
  }

  insertReading(reading);

  res.send(reading);
});

app.get('/api/getsensors', (req: Request, res: Response) => {
  console.log('Received getsensors request');
  getSensors()
    .then(rows => res.send(rows))
    .catch(err => res.status(500).send(err)); // HTTP 500 Internal Server Error
});

app.get('/api/getreadings', (req: Request, res: Response) => {
  console.log('Received getreadings request');
  getReadings()
    .then(rows => res.send(rows))
    .catch(err => res.status(500).send(err)); // HTTP 500 Internal Server Error
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
