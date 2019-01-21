# Palvelin

### 1. Alusta palvelinprojekti

Navigoi projektin kansioon ja juoke siellä seuraava komento, joka alustaa TypeScript-sovelluksen.
```shell
mkdir server
cd server
npm init -y
```

Asenna TypeScript ja alusta TypeScript-projekti:
```shell
npm install --save-dev typescript
tsc --init
```

Lisää `tsconfig.json`-tiedostoon outDir-asetus:
```
{
  "compilerOptions": {
    ...
    "outDir": "./build",
```

Aseta package.json tiedostoon build- ja start-komennot:
```
"scripts": {
  "build": "tsc -p tsconfig.json",
  "start": "npm run build && node ./build",
  ...
```

Luo `src/index.ts`-tiedosto:
```typescript
console.log('Helou Koodi- ja Eltykerho!');
```

Lisää `.gitignore`-tiedostoon `build/`-kansio.

Juokse `npm start` ja katso mitä tapahtuu!

### 2. Express-bäkkärin pystyttely

Asenna depsut eli express ja body-parser, sekä niiden tyyppitiedostot:
```shell
npm install --save express body-parser @types/express @types/body-parser
```

Tee `index.ts`-tiedostoon yksinkertainen express-päätepiste (eng. endpoint).
```TypeScript
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

app.post('/newreading', (req: Request, res: Response) => {
  console.log('received new reading:', req.body);
  res.send(req.body);
});


const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
```

Juokse `npm start` ja palvelimen pitäisi nyt vastaanottaa tavaraa sääasemalta.

### 3. Validoidaan sää asemalta tuleva data

Luodaan `types.d.ts`-tiedosto datatyyppejä varten. Lisätään mitta-arvon tyyppi.

```
interface Reading {
  name: string,
  temperature: number,
  pressure: number,
  humidity: number
}
```

Luodaan `util.ts`-tiedosto apufunktioita varten. 
Toteutetaan `assertReading-validointifunkkari sisään tulevien mitta-arvojen validointiin.

```TypeScript
const assertReading = (reading: Reading | null) => {
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

app.post('/newreading', (req: Request, res: Response) => {
  console.log('received new reading:', req.body);

  try {
    assertReading(req.body);
  }
  catch (error) {
    return res.status(400).send(error);
  }

  res.send(req.body);
});
...
```

Käynnistä palvelin uudelleen: `npm start`.
Nyt virheellisen datan lähettäminen palvelimelle heittää `HTTP 400 Bad Request`-virheilmoituksen.

### 4. SQLite tietokannan rakentelu

Asennetaan SQLite ja lisätään se dependensseihin.
```
npm install --save sqlite3 @types/sqlite3
```

Luodaan `dbUtils.ts`-tiedosto kannan kanssa painimista varten.
```TypeScript
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('database.db');

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

  db.run(sensorTableQuery)
    .run(readingTableQuery, err => {
      if (err) {
        return console.log('Database initialization failed.', err);
      }

      console.log('Database up and running!');
    });
};

export { initializeDB };
```

Lisätään `index.ts`-tiedostoon kutsu kannan alustus -funkkariin.
```TypeScript
...
import { initializeDB } from './dbUtils';

const app = express();
app.use(bodyParser.json());
const db = initializeDB();
...
```

`npm start` luo nyt uuden tietokannan jos sellaista ei vielä ole olemassa.

### 5. Tallennetaan vastaanotettu mitta-arvo kantaan

Lisätään `dbUtils.ts`-tiedostoon mitta-arvon talletus -funkkari.

```TypeScript
...
const insertReading = (reading: Reading) => {
  const {
    name: $name,
    temperature: $temperature,
    pressure: $pressure,
    humidity: $humidity
  } = reading;

  const $timestamp = new Date().toISOString();

  const insertSensorQuery = `
    INSERT OR IGNORE INTO sensor (name, firstonline, lastonline)
    VALUES ($name, $timestamp, $timestamp)
  `;

  const updateSensorQuery = `
    UPDATE sensor
    SET lastonline = $timestamp
    WHERE name = $name
  `;

  const insertReadingQuery = `
    INSERT INTO reading (sensorname, temperature, pressure, humidity)
    VALUES ($name, $temperature, $pressure, $humidity)
  `;

  db.run(insertSensorQuery, { $name, $timestamp })
    .run(updateSensorQuery, { $timestamp, $name })
    .run(insertReadingQuery, { $name, $temperature, $pressure, $humidity }, err => {
      if (err) {
        return console.log('Error inserting a new reading', err);
      }

      console.log('Inserted new reading successfully');
    });
};

export { initializeDB, insertReading };
```

Nyt uuden mitta-arvon lähettäminen päivittää sensor-tauluun sensorin online-ajankohdan
ja puskee mitta-arvon reading-tauluun.

