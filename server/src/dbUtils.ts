import sqlite3 from 'sqlite3';

const initializeDB = () => {
  const db = new sqlite3.Database('database.db');

  db.run(`CREATE TABLE IF NOT EXISTS sensor (
    name TEXT PRIMARY KEY,
    firstonline TEXT NOT NULL,
    lastonline TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS reading (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    temperature NUMERIC(5,2),
    pressure NUMERIC(5,2),
    humidity NUMBERIC(5,2),
    sensorname TEXT,
    FOREIGN KEY (sensorname) REFERENCES sensor(name)
  )`);

  return db;
};

export { initializeDB };
