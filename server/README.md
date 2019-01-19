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

  if (!name || typeof name !== 'string' || name.length > 3) {
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
    res.status(400).send(error);
    return;
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

const initializeDB = () => {
  const db = new sqlite3.Database('database.db');

  db.run(`CREATE TABLE IF NOT EXISTS sensor (
    name TEXT PRIMARY KEY,
    firstonline TEXT NOT NULL,
    lastonline TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS reading (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    temperature NUMERIC(5,2),
    pressure NUMERIC(5,2),
    humidity NUMBERIC(5,2),
    sensorname TEXT,
    FOREIGN KEY (sensorname) REFERENCES sensor(name)
  )`);

  return db;
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
