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

Asennetaan SQLite ja lisätään se dependensseihin.
```
yarn add better-sqlite3 @types/better-sqlite3
```

Luodaan `dbUtils.ts`-tiedosto kannan kanssa painimista varten.
```TypeScript
import Database from 'better-sqlite3';

const db = new Database('database.db');

/**
 *  Create tables for sensors and readings if none exist in the database.
 */
const initializeDB = () => {
  const sensorTableQuery = `
    CREATE TABLE IF NOT EXISTS sensor (
      name TEXT PRIMARY KEY,
      firstonline TEXT NOT NULL,
      lastonline TEXT NOT NULL
    )
  `;

  const readingTableQuery = `
    CREATE TABLE IF NOT EXISTS reading (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sensorname TEXT,
      temperature NUMERIC(10,2),
      pressure NUMERIC(10,2),
      humidity NUMERIC(10,2),
      FOREIGN KEY (sensorname) REFERENCES sensor(name)
    )
  `;

  db.prepare(sensorTableQuery)
    .run();

  db.prepare(readingTableQuery)
    .run();
};

export { initializeDB };
```

Lisätään `index.ts`-tiedostoon kutsu kannan alustus -funkkariin.
```TypeScript
...
import { initializeDB } from './dbUtils';

const app = express();
app.use(bodyParser.json());
initializeDB();
...
```

`yarn start` luo nyt uuden tietokannan jos sellaista ei vielä ole olemassa.

### 5. Tallennetaan vastaanotettu mitta-arvo kantaan

Lisätään `dbUtils.ts`-tiedostoon mitta-arvon talletus -funkkari.

```TypeScript
/**
 *  Insert a reading into the table 'reading'
 *  and update 'sensor' table
 */
const insertReading = (reading: NewReading) => {
  const insertData = {
    timestamp: new Date().toISOString(),
    ...reading,
  };

  // If the sensor is not in the 'sensor' table insert it
  const insertSensorQuery = `
    INSERT OR IGNORE INTO sensor (name, firstonline, lastonline)
    VALUES ($name, $timestamp, $timestamp)
  `;

  // update the sensor's last online time
  const updateSensorQuery = `
    UPDATE sensor
    SET lastonline = $timestamp
    WHERE name = $name
  `;

  // insert a reading into the table 'reading'
  const insertReadingQuery = `
    INSERT INTO reading (sensorname, temperature, pressure, humidity, timestamp)
    VALUES ($name, $temperature, $pressure, $humidity, $timestamp)
  `;

  db.prepare(insertSensorQuery)
    .run(insertData);

  db.prepare(updateSensorQuery)
    .run(insertData);

  db.prepare(insertReadingQuery)
    .run(insertData);
};

export { initializeDB, insertReading };
```

Nyt uuden mitta-arvon lähettäminen päivittää sensor-tauluun sensorin online-ajankohdan
ja puskee mitta-arvon reading-tauluun.

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

// TODO:
Lisätään `dbUtils.ts`-tiedostoon getData-funktio.

```TypeScript
...
/**
 *  Get sensor data from the database
 */
const getSensors = (): Sensor[] => {
  const query = `
    SELECT *
    FROM sensor
  `;

  return db.prepare(query)
    .all();
};

/**
 *  Get readings data from the database
 */
const getReadings = (): Reading[] => {
  const query = `
    SELECT sensorname, temperature, pressure, humidity, timestamp
    FROM reading
  `;

  return db.prepare(query)
    .all();
};

export { initializeDB, insertReading, getSensors, getReadings };
```

Luodaan uudet endpointit `index.ts`-tiedostoon.

```TypeScript
...
import { initializeDB, insertReading, getSensors, getReadings } from './dbUtils';
...

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

...
```

Tsekkaa nyt selaimella mitä löytyy osoitteista
http://localhost:3001/api/getsensors ja http://localhost:3001/api/getreadings.

**Siirrytään frontendin kimppuun!**
