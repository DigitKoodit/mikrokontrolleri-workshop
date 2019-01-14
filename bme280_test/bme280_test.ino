// Digitin koodikerho & elektroniikkakerho IoT workshop
// https://github.com/DigitKoodit/mikrokontrolleri-workshop
// Script for testing BME280 sensor

#include <Adafruit_BME280.h>
#include <Wire.h>

Adafruit_BME280 bme; //I2C

void setup() {
	Serial.begin(115200);
	Wire.begin();
    if (!bme.begin(0x76)) {  
    	Serial.println("Could not find a valid BME280 sensor, check wiring!");
    	while (1);
  	}else{
  		Serial.println("Found sensor");
  	}

}

void loop() {
	Serial.print("Temperature: ");
	Serial.println(bme.readTemperature());
	Serial.print("Pressure: ");
	Serial.println(bme.readPressure());
	Serial.print("Humidity: ");
	Serial.println(bme.readHumidity());

	delay(1000);
}