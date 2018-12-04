// Digitin koodikerho & elektroniikkakerho IoT workshop
// https://github.com/DigitKoodit/mikrokontrolleri-workshop


#include <Arduino.h>

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>

#include <ESP8266HTTPClient.h>

// #include <Adafruit_BME280.h>

ESP8266WiFiMulti WiFiMulti;

void setup() {
  	Serial.begin(115200);


  	WiFi.mode(WIFI_STA);
  	WiFiMulti.addAP("SSID", "passwd");
}

void loop() {
	// String payload = "";
	if (WiFiMulti.run() == WL_CONNECTED)
	{
		HTTPClient http;

		Serial.printf("[HTTP] begin...");

		http.begin("http://192.168.43.251:8080/api/readings");

		

		int httpcode = http.POST("Konsta ei osaa koodaa");

		if (httpcode == HTTP_CODE_OK)
		{
			Serial.printf("Toimii :D");
		}else{
			Serial.printf("Ei toimi :(");
		}

		http.end();
	}

	delay(10000);
}