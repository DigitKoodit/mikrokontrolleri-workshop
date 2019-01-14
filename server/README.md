# Palvelin

### 1. Alusta palvelin projekti


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
