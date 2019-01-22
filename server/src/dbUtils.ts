import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('database.db');

const initializeDB = () => {
  const sensorTableQuery = `
    CREATE TABLE IF NOT EXISTS sensor (
      name TEXT PRIMARY KEY,
      firstonline TEXT NOT NULL,
      lastonline TEXT NOT NULL
    )
  `;

  const readingTableQuery = `
    CREATE TABLE IF NOT EXISTS reading (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sensorname TEXT,
      temperature NUMERIC(10,2),
      pressure NUMERIC(10,2),
      humidity NUMERIC(10,2),
      timestamp TEXT,
      FOREIGN KEY (sensorname) REFERENCES sensor(name)
    )
  `;

  db.run(sensorTableQuery)
    .run(readingTableQuery, err => {
      if (err) {
        return console.log('Database initialization failed.', err);
      }

      console.log('Database up and running!');
    });
};

const insertReading = (reading: NewReading) => {
  // dollar signs are required for SQL query templating
  const {
    name: $name,
    temperature: $temperature,
    pressure: $pressure,
    humidity: $humidity,
  } = reading;

  const $timestamp = new Date().toISOString();

  const insertSensorQuery = `
    INSERT OR IGNORE INTO sensor (name, firstonline, lastonline)
    VALUES ($name, $timestamp, $timestamp)
  `;

  const updateSensorQuery = `
    UPDATE sensor
    SET lastonline = $timestamp
    WHERE name = $name
  `;

  const insertReadingQuery = `
    INSERT INTO reading (sensorname, temperature, pressure, humidity, timestamp)
    VALUES ($name, $temperature, $pressure, $humidity, $timestamp)
  `;

  db.run(insertSensorQuery, { $name, $timestamp })
    .run(updateSensorQuery, { $timestamp, $name })
    .run(insertReadingQuery, { $name, $temperature, $pressure, $humidity, $timestamp }, err => {
      if (err) {
        return console.log('Error inserting a new reading', err);
      }

      console.log('Inserted new reading successfully');
    });
};

const getSensors = async (): Promise<Sensor[]> => {
  const query = `
    SELECT *
    FROM sensor
  `;

  return new Promise((resolve, reject) => {
    db.all(query, (err, rows) => {
      if (err) {
        console.log('Fetching sensors failed', err);
        reject(err);
      }

      resolve(rows);
    })
  })
};

// TODO: Update README
const getReadings = async (): Promise<FormattedReadings> => {
  const query = `
    SELECT sensorname, temperature, pressure, humidity, timestamp
    FROM reading
  `;

  return new Promise((resolve, reject) => {
    db.all(query, (err, rows: Reading[]) => {
      if (err) {
        console.log('Fetching readings failed', err);
        reject(err);
      }

      const result = rows.reduce(formatReading, {
        temperature: [],
        pressure: [],
        humidity: []
      });

      resolve(result);
    })
  });
};

const formatReading = (acc: FormattedReadings, reading: Reading): FormattedReadings => {
  return {
    temperature: addNewReading(acc.temperature, reading, 'temperature'),
    pressure: addNewReading(acc.pressure, reading, 'pressure'),
    humidity: addNewReading(acc.humidity, reading, 'pressure')
  }
};

// TODO: refactor to not look like ass
const addNewReading = (prevReadings: ReadingsForProperty[],
                       reading: Reading,
                       property: 'temperature' | 'pressure' | 'humidity'): ReadingsForProperty[] => {
  if (prevReadings.some(r => r.sensorname === reading.sensorname)) {
    return prevReadings.map(oldReading => {
      if (oldReading.sensorname === reading.sensorname) {
        return {
          ...oldReading,
          readings: [
            ...oldReading.readings,
            {
              timestamp: reading.timestamp,
              value: reading[property]
            }
          ]
        } as ReadingsForProperty
      }
      else {
        return oldReading
      }
    })
  }
  else {
    return [
      ...prevReadings,
      {
        sensorname: reading.sensorname,
        readings: [{
          timestamp: reading.timestamp,
          value: reading[property]
        }]
      }
    ]
  }
};

export { initializeDB, insertReading, getSensors, getReadings };
