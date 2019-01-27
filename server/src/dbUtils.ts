import Database from 'better-sqlite3';

const db = Database('database.db');

/**
 *  Create tables for sensors and readings if none exist in the database.
 */
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

  db.prepare(sensorTableQuery)
    .run();

  db.prepare(readingTableQuery)
    .run();
};

/**
 *  Insert a reading into the table 'reading'
 *  and update 'sensor' table
 */
const insertReading = (reading: NewReading) => {
  const insertData = {
    timestamp: new Date().toISOString(),
    ...reading,
  };

  // If the sensor is not in the 'sensor' table insert it
  const insertSensorQuery = `
    INSERT OR IGNORE INTO sensor (name, firstonline, lastonline)
    VALUES ($name, $timestamp, $timestamp)
  `;

  // update the sensor's last online time
  const updateSensorQuery = `
    UPDATE sensor
    SET lastonline = $timestamp
    WHERE name = $name
  `;

  // insert a reading into the table 'reading'
  const insertReadingQuery = `
    INSERT INTO reading (sensorname, temperature, pressure, humidity, timestamp)
    VALUES ($name, $temperature, $pressure, $humidity, $timestamp)
  `;

  db.prepare(insertSensorQuery)
    .run(insertData);

  db.prepare(updateSensorQuery)
    .run(insertData);

  db.prepare(insertReadingQuery)
    .run(insertData);
};

/**
 *  Get sensor data from the database
 */
const getSensors = (): Sensor[] => {
  const query = `
    SELECT *
    FROM sensor
  `;

  return db.prepare(query)
    .all();
};

/**
 *  Get readings data from the database
 */
const getReadings = (): Reading[] => {
  const query = `
    SELECT sensorname, temperature, pressure, humidity, timestamp
    FROM reading
  `;

  return db.prepare(query)
    .all();
};

export { initializeDB, insertReading, getSensors, getReadings };
