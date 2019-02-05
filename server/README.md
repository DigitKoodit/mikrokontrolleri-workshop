# Palvelin

### 1. Alusta palvelinprojekti

Navigoi projektin kansioon ja juoke siellä seuraava komento, joka alustaa TypeScript-sovelluksen.
```shell
mkdir server
cd server
yarn init -y
```

Asenna TypeScript ja alusta TypeScript-projekti:
```shell
yarn add --dev typescript
tsc --init
```

Lisää `tsconfig.json`-tiedostoon lib ja outDir-kentät:
```
{
  "compilerOptions": {
    ...
    "lib": ["esnext"],
    "outDir": "./build",
    ...
```

Aseta package.json tiedostoon build- ja start-komennot:
```
...
"scripts": {
  "build": "tsc -p tsconfig.json",
  "start": "yarn build && node ./build"
}
...
```

Luo `src/index.ts`-tiedosto:
```typescript
console.log('Helou Koodi- ja Eltykerho!');
```

Lisää `.gitignore`-tiedostoon `build/`-kansio.

Juokse `yarn start` ja katso mitä tapahtuu!

### 2. Express-bäkkärin pystyttely

Asenna depsut eli express ja body-parser, sekä niiden tyyppitiedostot:
```shell
yarn add express body-parser @types/express @types/body-parser
```

Tee `index.ts`-tiedostoon yksinkertainen express-päätepiste (eng. endpoint).
```TypeScript
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

/**
 * POST /api/newreading
 * Send a new reading from the sensor to the server.
 */
app.post('/api/newreading', (req: Request, res: Response) => {
  console.log('received new reading:', req.body);
  res.send(req.body);
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
```

Juokse `yarn start` ja palvelimen pitäisi nyt vastaanottaa tavaraa sääasemalta.

### 3. Validoidaan sää asemalta tuleva data

Luodaan `types.d.ts`-tiedosto datatyyppejä varten. Lisätään mitta-arvon tyyppi.

```
interface NewReading {
  name: string,
  temperature: number,
  pressure: number,
  humidity: number
}
```

Luodaan `util.ts`-tiedosto apufunktioita varten. 
Toteutetaan `assertReading-validointifunkkari sisään tulevien mitta-arvojen validointiin.

```TypeScript
const assertReading = (reading: NewReading | null) => {
  if (!reading) {
    throw 'Invalid request body';
  }

  const { name, temperature, pressure, humidity } = reading;

  if (!name || typeof name !== 'string' || name.length < 3) {
    throw 'Invalid or missing parameter "name"';
  }
  else if (!temperature || typeof temperature !== 'number') {
    throw 'Invalid or missing parameter "temperature"';
  }
  else if (!pressure || typeof pressure !== 'number') {
    throw 'Invalid or missing parameter "temperature"';
  }
  else if (!humidity || typeof humidity !== 'number') {
    throw 'Invalid or missing parameter "humidity"';
  }
};

export { assertReading };
```

Validoidaan sääasemalta tullut kama uuden funkkarin kanssa. `index.ts`:
```TypeScript
...
import { assertReading } from './util';

const app = express();
app.use(bodyParser.json());

/**
 * POST /api/newreading
 * Send a new reading from the sensor to the server.
 */
app.post('/api/newreading', (req: Request, res: Response) => {
  const reading: NewReading = req.body;
  console.log('received new reading:', reading);

  try {
    assertReading(reading);
  }
  catch (error) {
    return res.status(400).send(error); // HTTP 400 Bad Request
  }

  res.send(reading);
});
...
```

Käynnistä palvelin uudelleen: `yarn start`.
Nyt virheellisen datan lähettäminen palvelimelle heittää `HTTP 400 Bad Request`-virheilmoituksen.

### 4. SQLite tietokannan rakentelu

Asennetaan SQLite ja sql-template-strings js lisätään ne dependensseihin.
```
yarn add sqlite sql-template-strings
```

Luodaan `migrations/001-initial-schema.sql`-tiedosto, joka alustaa kaksi taulua tietokantaan.
```SQL
-- Up
CREATE TABLE Sensor (
  name TEXT PRIMARY KEY,
  firstonline TEXT NOT NULL,
  lastonline TEXT NOT NULL
);
CREATE TABLE Reading (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sensorname TEXT,
  temperature NUMERIC(10,2),
  pressure NUMERIC(10,2),
  humidity NUMERIC(10,2),
  timestamp TEXT,
  FOREIGN KEY (sensorname) REFERENCES sensor(name)
);

-- Down
DROP TABLE Sensor;
DROP TABLE Reading;
```

Luodaan `src/dbUtils.ts`-tiedosto kannan kanssa painimista varten.
```TypeScript
import sqlite from 'sqlite';

// initialize database
const dbPromise = Promise.resolve()
  .then(() => sqlite.open('database.db'))
  .then(db => db.migrate({ force: 'last' }));
```

### 5. Talletetaan uusi mitta-arvo kantaan

Lisätään `dbUtils.ts`-tiedostoon insertReading-funkkari.

```TypeScript
import sqlite from 'sqlite';
import SQL from 'sql-template-strings';

...

/**
 *  Insert a reading into the table 'reading'
 *  and update 'sensor' table
 */
const insertReading = (reading: NewReading): Promise<void> => {
  const { name, temperature, pressure, humidity } = reading;
  const timestamp = new Date().toISOString();

  // If the sensor is not in the 'sensor' table insert it
  const insertSensorQuery = SQL`
    INSERT OR IGNORE INTO sensor (name, firstonline, lastonline)
    VALUES (${name}, ${timestamp}, ${timestamp})
  `;

  // update the sensor's last online time
  const updateSensorQuery = SQL`
    UPDATE sensor
    SET lastonline = ${timestamp} WHERE name = ${name}
  `;

  // insert a reading into the table 'reading'
  const insertReadingQuery = SQL`
    INSERT INTO reading (sensorname, temperature, pressure, humidity, timestamp)
    VALUES (${name}, ${temperature}, ${pressure}, ${humidity}, ${timestamp})
  `;

  return dbPromise
    .then(db => Promise.all([
      db.run(insertSensorQuery),
      db.run(updateSensorQuery),
      db.run(insertReadingQuery)
    ]))
    .then(() => console.log('Successfully inserted reading into database.'));
};
```

Lisätään `index.ts`-tiedostoon funktiokutsu mitta-arvon tallettamiseen.
```TypeScript
...
import { insertReading } from './dbUtils';

...

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

  insertReading(reading)
    .then(() => res.send(reading))
    .catch(err => res.status(500).send(err)); // HTTP 500 Internal Server Error
});
```

### 6. Toteutetaan getsensors ja getreadings endpointit

Lisätään `types.d.ts`-tiedostoon Sensor ja Reading tyyppimäärittelyt.

```TypeScript
...
interface Sensor {
  name: string,
  firstonline: string,
  lastonline: string
}

interface Reading {
  sensorname: string,
  temperature: number,
  pressure: number,
  humidity: number
}
```

### 7. Toteutaan datan haku kannasta

```TypeScript
...
/**
 *  Get sensor data from the database
 */
const getSensors = (): Promise<Sensor[]> => {
  const query = `
    SELECT *
    FROM sensor
  `;

  return dbPromise
    .then(db => db.all(query));
};

/**
 *  Get readings data from the database
 */
const getReadings = (noOfReadings: number = 100): Promise<Reading[]> => {
  console.log(noOfReadings)
  const query = SQL`
    SELECT sensorname, temperature, pressure, humidity, timestamp
    FROM Reading
    ORDER BY timestamp DESC
    LIMIT ${noOfReadings}
  `;

  return dbPromise
    .then(db => db.all(query));
};

export { insertReading, getSensors, getReadings };
```

Luodaan uudet endpointit `index.ts`-tiedostoon.

```TypeScript
...
import { insertReading, getSensors, getReadings } from './dbUtils';
...

/**
 * GET /api/getsensors
 * List sensor data.
 */
app.get('/api/getsensors', (req: Request, res: Response) => {
  console.log('Received getsensors request');
  getSensors()
    .then(sensors => res.send(sensors))
    .catch(err => res.status(500).send(err)); // HTTP 500 Internal Server Error
});

/**
 * GET /api/getreadings
 * List reading data.
 */
app.get('/api/getreadings/:limit', (req: Request, res: Response) => {
  console.log('Received getreadings request');
  getReadings(req.params.limit)
    .then(readings => res.send(readings))
    .catch(error => res.status(500).send(error)); // HTTP 500 Internal Server Error
});

...
```

Tsekkaa nyt selaimella mitä löytyy osoitteista
http://localhost:3001/api/getsensors ja http://localhost:3001/api/getreadings.

**Siirrytään frontendin kimppuun!**
