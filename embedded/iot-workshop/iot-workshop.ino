#include <Wire.h>
#include <Adafruit_BME280.h>

#include <ESP8266WiFiMulti.h>

ESP8266WiFiMulti WiFiMulti;

Adafruit_BME280 sensor;
void setup() {
  
  Serial.begin(115200);
  
  Wire.begin();

  if(!sensor.begin(0x76)){
  	Serial.println("Error: Sensor not found");
  }

  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP("Pixel_3", "88888888");
  
}

void loop() {
  // put your main code here, to run repeatedly:
  Serial.println(sensor.readTemperature());
  
  if(WiFiMulti.run() == WL_CONNECTED){
    Serial.print("Connection established, local IP: ");
    Serial.println(WiFi.localIP());
  	delay(1000);
  }
  	Serial.println("...");
  delay(1000);

}
