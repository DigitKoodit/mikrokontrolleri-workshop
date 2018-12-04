# mikrokontrolleri-workshop
Koodikerhon mikrokontrolleri workshop jossa rakennellaan sääasema IoT-härpätin ja nettisivu, josta pääsee
katselemaan kerättyä dataa. Alustana sääasemalle on ESP8266-mikrokontrolleri, joka ajaa Arduino-yhteensopivaa 
C++–ohjelmointikielen kaltaista koodia, ja puskee keräämäänsä dataa JSON-muodossa HTTP POST -pyynnöllä serverille.

Backend on tehty Node.js, Express ja SQLite tekniikoilla. Frontend on toteutettu JavaScript ja React tekniikoilla.

## Ohjeet
### 1. Asenna Arduino IDE

Seuraa näitä ohjeita: [Linkki](https://randomnerdtutorials.com/how-to-install-esp8266-board-arduino-ide/).

Oikea Board-asetus on **LOLIN(WEMOS) D1 R2 & mini**.

### 2. Alusta Git-repositorio (vapaaehtoinen)

**Disclaimer:** Gitin käyttäminen ei ole täysin pakollista, mutta erittäin suotavaa, koska se helpottaa ryhmätyön
tekemistä huomattavasti.

1. Tee itsellesi GitHub-tili. Ilmainen vinkki: yliopiston mailin käyttäminen antaa ilmaista kamaa GitHubista
2. Luo uusi tyhjä repositorio. Jos teette ryhmässä kannattaa käyttää yhteistä repoa. Kannattaa laittaa ainakin 
README.md helppoa kloonausta varten.
3. Kloonatkaa jokainen repo omalle koneelle.

### 2. Rakenna IoT-härpätin

// TODO: kirjoita ohjeet

### 3. Pystytä minimalistinen palvelin

Navigoi projektin kansioon ja juoke siellä seuraava komento, joka alustaa Node.js-sovelluksen.
```shell
npm init ./server
```

Rakentele tänne fiksua kamaa, joka vastaanottaa dataa sääasema-laitteelta.