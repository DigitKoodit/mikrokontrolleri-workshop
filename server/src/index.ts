import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

import { assertReading } from './util';
import { initializeDB, insertReading } from './dbUtils';

const app = express();
app.use(bodyParser.json());
initializeDB();

app.post('/newreading', (req: Request, res: Response) => {
  const reading: Reading = req.body;
  console.log('received new reading:', reading);

  try {
    assertReading(reading);
  }
  catch (error) {
    return res.status(400).send(error);
  }

  insertReading(reading);

  res.send(reading);
});


const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
