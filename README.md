# IoT-workshop
Koodikerhon mikrokontrolleri workshop jossa rakennellaan sääasema IoT-härpätin ja nettisivu, josta pääsee
katselemaan kerättyä dataa. Alustana sääasemalle on ESP8266-mikrokontrolleri, joka ajaa Arduino-yhteensopivaa 
C++–ohjelmointikieltä, ja puskee keräämäänsä dataa JSON-muodossa HTTP POST -pyynnöllä serverille.

Backend on tehty Node.js, Express ja SQLite tekniikoilla. Frontend on toteutettu JavaScript ja React tekniikoilla.

## Esivaatimukset

### 1. Asenna Arduino IDE ja ESP8266-lisäri

Seuraa näitä ohjeita: [////(Linkki)////](https://randomnerdtutorials.com/how-to-install-esp8266-board-arduino-ide/).

Oikea Board-asetus on **LOLIN(WEMOS) D1 R2 & mini**.

### 2. Asenna Node.js ja create-react-app

Asenna Node.js versio 10 joko [täältä](https://nodejs.org/) tai NVM:n (Node Version Manager) avulla 
[täältä](https://github.com/creationix/nvm).

NVM:n kanssa itse Node.js asentuu juoksemalla terminaalissa:
```
nvm install 10
nvm use 10
```

Yarn ja create-react-app asentuu kivasti NPM:llä:
```
npm install --global yarn create-react-app
```

Tämä on ainoa kerta kun workshopissa käytetään npm:ää, tästä eteenpäin pelkkää yarnia.

## Ohjeet

**Disclaimer:** Gitin käyttäminen ei ole täysin pakollista, mutta erittäin suotavaa, koska se helpottaa ryhmätyön
tekemistä huomattavasti.

1. Tee itsellesi GitHub-tili. Ilmainen vinkki: yliopiston mailin käyttäminen antaa ilmaista kamaa GitHubista
2. Luo uusi tyhjä repositorio. Jos teette ryhmässä kannattaa käyttää yhteistä repoa. Kannattaa laittaa ainakin 
README.md helppoa kloonausta varten.
3. Kloonatkaa jokainen repo omalle koneelle.

**[Mennään sularipuolen kimppuun!](embedded/)**
