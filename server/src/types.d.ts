interface NewReading {
  name: string,
  temperature: number,
  pressure: number,
  humidity: number
}

interface Sensor {
  name: string,
  firstonline: string,
  lastonline: string
}

interface Reading {
  sensorname: string,
  temperature: number,
  pressure: number,
  humidity: number,
  timestamp: string
}

interface FormattedReadings {
  temperature: ReadingsForProperty[],
  pressure: ReadingsForProperty[],
  humidity: ReadingsForProperty[]
}

interface ReadingsForProperty {
  sensorname: string,
  readings: [{
    value: number,
    timestamp: string
  }]
}
