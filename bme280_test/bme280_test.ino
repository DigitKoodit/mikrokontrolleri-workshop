// Digitin koodikerho & elektroniikkakerho IoT workshop
// https://github.com/DigitKoodit/mikrokontrolleri-workshop
// Script for testing BME280 sensor

#include <Adafruit_BME280.h>
#include <Wire.h>
#include <ArduinoJson.h>
#include <ArduinoJson.hpp>

#define I2C_ADDR 0x76 // define the sensor i2c address


Adafruit_BME280 bme;

char name[] = "KONSTA";


const int capacity = JSON_OBJECT_SIZE(4);
StaticJsonDocument<capacity> jd;

void setup() {
	Serial.begin(115200);
	Wire.begin();
    if (!bme.begin(I2C_ADDR)) {  
    	Serial.println("Could not find a valid BME280 sensor, check wiring!");
    	while (1);
  	}else{
  		Serial.println("Found sensor");
  	}

}

void loop() {
	// Serial.print("Temperature: ");
	// Serial.println(bme.readTemperature());
	// Serial.print("Pressure: ");
	// Serial.println(bme.readPressure());
	// Serial.print("Humidity: ");
	// Serial.println(bme.readHumidity());

	
  	JsonObject data = doc.to<JsonObject>();
  	
  	data["name"] 		= name;
  	data["temperature"]	= bme.readTemperature();
  	data["pressure"] 	= bme.readPressure();
  	data["humidity"]	= bme.readHumidity();

  	String output;
  	serializeJson(data, output);
	JsonObject& obj = jb.parseObject(payload);
	
	
	delay(1000);
}