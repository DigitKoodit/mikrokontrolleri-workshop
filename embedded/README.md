# IoT-workshop ESP-ohje
Workshopin sularipuolen README

Hakemistosta iot-workshop löytyy Arduino-koodi, jota täydennetään workshopin edetessä.

## Kertausta:
Jos teit jo nämä, hyppää kohtaan Kirjastot

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

Kytkentöjä tehtäessä on hyvä ottaa virrat pois laitteista, ettei vahingossa oikosulkuun sohaistut komponentit päästä toimintasavuja pihalle. 

Kytketään siis laudan 3.3V nasta (merkitty 3V3) sensorin Vin-nastaan ja ground-nastat toisiinsa. Näitä voi ajatella vastaavasti plus- ja miinusnapoina. Sitten kytketään D1 -> SCL ja D2 -> SDA.

Sensori käyttää I2C-standardin väylää tiedonsiirtoon ja tämän laudan I2C-nastat ovat oletuksena D1 (SCL) ja D2 (SDA). Nämä voi vaihtaa minkä tahansa GPIO-nastojen kanssa, mikäli kokee tarpeelliseksi. Esimerkkiohjelma on tehty kuvassa näkyvällä kytkennällä.


## Kirjastot

Kirjastot ovat valmiita ohjelmapalasia, joita voidaan käyttää vapaasti, kun ei ole halua lähteä keksimään pyörää uudestaan. Arduino IDE:ssä kirjastoja pääsee lataamaan Tools-valikon alta kohdasta **Manage libraries...**

Tähän työhön vaadittavat kirjastot ovat seuraavassa listassa mielivaltaisessa järjestyksessä:

* Adafruit BME280 Library
* ArduinoJson (HUOM! Version 6 julkaisut ovat vielä kokeellisia, joten käytämme versiota 5.13.4)
* Adafruit unified sensor (BME280-sensorikirjasto vaatii tämän toimiakseen)

Kirjastoja saadaan käyttöön kirjoittamalla seuraavanlaisia rivejä tiedoston alkuun:
``` 
#include <kirjasto.h>
```

Tai Arduino IDE:n Sketch -valikosta valitsemalla Include library. Mikäli valitsemaasi kirjastoa ei löydy valikosta, klikkaa listan yläreunasta Manage Libraries ja etsi puuttuvat kirjastot käsin.

Projektimme includet näyttävät siis suunnilleen tältä:
```
#include <ArduinoJson.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <Adafruit_BME280.h>
#include <Wire.h>
```

**[Mennään palvelinpään kimppuun!](../server/)**
