// Digitin koodikerho & elektroniikkakerho IoT workshop
// https://github.com/DigitKoodit/mikrokontrolleri-workshop



#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>

#include <Adafruit_BME280.h>
#include <Wire.h>
#include <ArduinoJson.h>

#define I2C_ADDR 0x76 	// define the sensor i2c address
#define SSID "Ebinverkko" 		// Wifi SSID
#define PASSWD "EllukkaOnPomo" 		// Wifi passwd
#define IP "http://192.168.0.1:8080/api/readings"			// Server IP-address
#define NAME "TestiPalikka"			// Group name



ESP8266WiFiMulti WiFiMulti;

// Initialize sensor
Adafruit_BME280 bme;

// Initialize json document
const int capacity = JSON_OBJECT_SIZE(4);
StaticJsonDocument<capacity> jb;

void setup() {
  	Serial.begin(115200);

  	Wire.begin();
  	if(!bme.begin(I2C_ADDR)){
  		Serial.println("Error: sensor not found");
  	}

  	WiFi.mode(WIFI_STA);
  	WiFiMulti.addAP(SSID, PASSWD);
}

void loop() {
	
  	String output;
	JsonObject& data = jb.createNestedObject();
	data["name"] = NAME;
	data["temperature"] = bme.readTemperature();
	data["pressure"] = bme.readPressure();
	data["humidity"] = bme.readHumidity();
	serializeJson(data, output);
  	serializeJsonPretty(data, Serial);
	
	if (WiFiMulti.run() == WL_CONNECTED)
	{
		HTTPClient http;

		
	
  		
		

		Serial.printf("[HTTP] begin...");

		http.begin(IP);
		http.addHeader("Content-Type", "application/json");

		

		int httpcode = http.POST(output);

		if (httpcode == HTTP_CODE_OK)
		{
			Serial.println("Toimii :D");
		}else{
			Serial.println("Ei toimi :(");
			Serial.println(httpcode);
		}

		http.end();
	}

	delay(10000);
}