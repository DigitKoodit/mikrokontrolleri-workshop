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

const insertReading = (reading: Reading) => {
  const {
    name: $name,
    temperature: $temperature,
    pressure: $pressure,
    humidity: $humidity
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
    INSERT INTO reading (sensorname, temperature, pressure, humidity)
    VALUES ($name, $temperature, $pressure, $humidity)
  `;

  db.run(insertSensorQuery, { $name, $timestamp })
    .run(updateSensorQuery, { $timestamp, $name })
    .run(insertReadingQuery, { $name, $temperature, $pressure, $humidity }, err => {
      if (err) {
        return console.log('Error inserting a new reading', err);
      }

      console.log('Inserted new reading successfully');
    });
};

const getSensors = async () => {
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

const getReadings = async () => {
  const query = `
    SELECT sensorname, temperature, pressure, humidity
    FROM reading
  `;

  return new Promise((resolve, reject) => {
    db.all(query, (err, rows) => {
      if (err) {
        console.log('Fetching readings failed', err);
        reject(err);
      }

      resolve(rows);
    })
  });
};

export { initializeDB, insertReading, getSensors, getReadings };
