# Fake sensor

This script pretends it's a sensor.

To use, run:
```Shell
yarn
node sensor.js
```

## Näin potkit tyhjästä pystyyn:

```
mkdir fake_sensor
cd fake_sensor
echo "node_modules/" > .gitignore
yarn init -y
yarn add axios
```

Kopipastaa `sensor.js`-tiedostoon:
```JavaScript
const axios = require('axios');

// round number to two decimal places
const round = num => Math.round(num * 100) / 100;

const url = 'http://localhost:3001/api/newreading';

// generate random data
const data = {
  name: 'Timo Teekkari',
  temperature: round(17 + (5 * Math.random())),
  pressure: round(8500 + (2500 * Math.random())),
  humidity: round(14 + (76 * Math.random()))
};

axios.post(url, data)
  .then(() => console.log('success'))
  .catch(err => {
    if (!err.response) {
      return console.log('Error: Did not get response from the server.')
    }

    console.log('Error:', err.response.data)
  });
```

Ajetaan huutamalla `node sensor.js`.
