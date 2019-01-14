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
  console.log('received new reading', req.body);
  res.send(req.body);
});


const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
```

Juokse `npm start` ja palvelimen pitäisi nyt vastaanottaa tavaraa sääasemalta.
