import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

import { assertReading } from './util';
import { initializeDB } from './dbUtils';

const app = express();
app.use(bodyParser.json());
const db = initializeDB();

app.post('/newreading', (req: Request, res: Response) => {
  console.log('received new reading:', req.body);

  try {
    assertReading(req.body);
  }
  catch (error) {
    res.status(400).send(error);
    return;
  }

  res.send(req.body);
});


const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
