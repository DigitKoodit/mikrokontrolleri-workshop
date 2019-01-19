import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('database.db');

const initializeDB = () => {
  db.run(`CREATE TABLE IF NOT EXISTS sensor (
      name TEXT PRIMARY KEY,
      firstonline TEXT NOT NULL,
      lastonline TEXT NOT NULL
    )`)
    .run(`CREATE TABLE IF NOT EXISTS reading (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sensorname TEXT,
      temperature NUMERIC(10,2),
      pressure NUMERIC(10,2),
      humidity NUMERIC(10,2),
      FOREIGN KEY (sensorname) REFERENCES sensor(name)
    )`, err => {
      if (err) {
        return console.log('Database initialization failed.', err);
      }

      console.log('Database up and running!');
    });

};

const insertReading = (reading: Reading) => {
  const { name, temperature, pressure, humidity } = reading;
  const timestamp = new Date().toISOString();

  db.run(`
      INSERT OR IGNORE INTO sensor (name, firstonline, lastonline) VALUES ($name, $lastonline, $lastonlone)
    `, {
      $name: name,
      $lastonline: timestamp
    })
    .run(`
      UPDATE sensor SET lastonline = $lastonline WHERE name = $name
    `, {
      $lastonline: timestamp,
      $name: name
    })
    .run(
      `INSERT INTO reading (sensorname, temperature, pressure, humidity) VALUES (?, ?, ?, ?)`,
      [name, temperature, pressure, humidity],
      err => {
        if (err) {
          return console.log('Error inserting a new reading', err);
        }

        console.log('Inserted new reading successfully');
      }
    );
};

export { initializeDB, insertReading };
