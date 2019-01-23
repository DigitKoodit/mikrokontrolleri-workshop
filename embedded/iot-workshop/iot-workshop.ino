#include <Wire.h>
#include <Adafruit_BME280.h>

#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>

#include <ArduinoJson.h>

#define IP "http://192.168.43.175:3001/api/newreading"


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
  StaticJsonBuffer<4> jbuffer;
  String output = "";
  JsonObject& data = jbuffer.createObject();

  data["name"] = "Waitee";
  data["temperature"] = sensor.readTemperature();
  data["pressure"] = sensor.readPressure();
  data["humidity"] = sensor.readHumidity();

  data.prettyPrintTo(Serial);
  
  if(WiFiMulti.run() == WL_CONNECTED){
    Serial.print("Connection established, local IP: ");
    Serial.println(WiFi.localIP());
    HTTPClient http;

    http.begin(IP);
    http.addHeader("Content-Type", "application/json");

    int httpcode = http.POST("testi");

    if(httpcode == HTTP_CODE_OK){
        Serial.println("Toimii :D");
    }else{
    	Serial.println("Ei toimi :(");
    	Serial.println(httpcode);
  	}
  	Serial.println("...");
  delay(1000);

	}
}
