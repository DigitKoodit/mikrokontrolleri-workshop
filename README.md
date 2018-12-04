# mikrokontrolleri-workshop
Koodikerhon mikrokontrolleri workshop jossa rakennellaan sääasema IoT-härpätin ja nettisivu, josta pääsee
katselemaan kerättyä dataa. Alustana sääasemalle on ESP8266-mikrokontrolleri, joka ajaa Arduino-yhteensopivaa 
C++–ohjelmointikielen kaltaista koodia, ja puskee keräämäänsä dataa JSON-muodossa HTTP POST -pyynnöllä serverille.

Backend on tehty Node.js, Express ja SQLite tekniikoilla. Frontend on toteutettu JavaScript ja React tekniikoilla.

## Esivaatimukset

### 1. Asenna Arduino IDE ja ESP8266-lisäri

Seuraa näitä ohjeita: [Linkki](https://randomnerdtutorials.com/how-to-install-esp8266-board-arduino-ide/).

Oikea Board-asetus on **LOLIN(WEMOS) D1 R2 & mini**.

### 2. Asenna Node.js ja create-react-app

Asenna Node.js versio 10 joko [täältä](https://nodejs.org/) tai NVM:n (Node Version Manager) avulla 
[täältä](https://github.com/creationix/nvm).

NVM:n kanssa itse Node.js asentuu juoksemalla terminaalissa:
```
nvm install 10
nvm use 10
```

Create-react-app asentuu kivasti NPM:llä:
```
npm install --global create-react-app
```

## Ohjeet
### 1. Alusta Git-repositorio (vapaaehtoinen)

**Disclaimer:** Gitin käyttäminen ei ole täysin pakollista, mutta erittäin suotavaa, koska se helpottaa ryhmätyön
tekemistä huomattavasti.

1. Tee itsellesi GitHub-tili. Ilmainen vinkki: yliopiston mailin käyttäminen antaa ilmaista kamaa GitHubista
2. Luo uusi tyhjä repositorio. Jos teette ryhmässä kannattaa käyttää yhteistä repoa. Kannattaa laittaa ainakin 
README.md helppoa kloonausta varten.
3. Kloonatkaa jokainen repo omalle koneelle.

### 2. Rakenna IoT-härpätin

![kytkentakaavio](https://github.com/DigitKoodit/mikrokontrolleri-workshop/blob/master/schematic.png)

### 3. Pystytä minimalistinen testipalvelin

Navigoi projektin kansioon ja juoke siellä seuraava komento, joka alustaa Node.js-sovelluksen.
```shell
mkdir server
cd server
npm init
```
Vakioasetukset toimii, mutta saa toki halutessaan muuttaa.

Asenna depsut eli Express ja Body-parser:
```shell
npm install --save express body-parser
```

Paiskaa server.js-tiedostoon testipalvelimen koodi:

```javascript
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

app.post("/api/readings", (req, res) => {
    console.log("Received new POST request");
    console.log(req.body)
    res.status(200).json(req.body);
});

const port = process.env.PORT ? process.env.PORT : 8080;
const server = app.listen(port, () => {
    console.log("Server listening on port %s", port);
});
```

Aja palvelin komennolla `npm start`.