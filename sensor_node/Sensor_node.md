#IoT-Workshop ESP-ohje
Ohje ESP8266 -mikrokontrollerin käyttöönottoon ja ohjelmointiin.

## Kertauksena:
### 1. Asenna Arduino IDE ja ESP8266-lisäri

Seuraa näitä ohjeita: [////(Linkki)////](https://randomnerdtutorials.com/how-to-install-esp8266-board-arduino-ide/).

Käytetään Board-asetuksena **LOLIN(WEMOS) D1 R2 & mini** ja Upload speed -asetuksena 115200.


## Kirjastot

Kirjastot ovat valmiita ohjelmapalasia, joita voidaan käyttää vapaasti, kun ei ole halua lähteä keksimään pyörää uudestaan. Arduino IDE:ssä kirjastoja pääsee lataamaan Tools-valikon alta kohdasta **Manage libraries...**

Tähän työhön vaadittavat kirjastot ovat seuraavassa listassa mielivaltaisessa järjestyksessä:

* Adafruit BME280 Library
* ArduinoJson (HUOM! Version 6 julkaisut ovat vielä kokeellisia, joten käytämme versiota 5.13.4)
* 