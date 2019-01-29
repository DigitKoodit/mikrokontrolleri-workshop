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

interface Graph {
  property: 'temperature' | 'pressure' | 'humidity',
  points: [{
    sensorname: string,
    data: {
      // seconds from last midnight
      x: number,
      // value of the thing measured
      y: number
    }
  }]
}
