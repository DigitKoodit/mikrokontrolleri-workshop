
# Etupää =D

### Luodaan React-appis

Navigoi takaisin projektin juureen ja aja siellä:

```
create-react-app client --typescript
cd client
yarn start
```

Selaimella http://localhost:3000 löytyy nyt uusi sivu.

Sinulla on nyt toimivan React-appiksen runko. Onnittelut!

Create-react-app loi paljon tiedostoja mutta suurimmasta osasta ei tarvitse välittää.

### Luodaan uusi SensorTable komponentti

Luodaan `SensorTable.tsx`-tiedosto:
```TypeScript
import React, { Component } from 'react';

class SensorTable extends Component {
  render() {
    return (
      'Morjesta jäbille!'
    );
  }
}

export default SensorTable;
```

Mountataan uusi komponentti `App.tsx`-tiedostossa.

```TypeScript
import React, { Component } from 'react';

import SensorTable from './SensorTable';

class App extends Component {
  render() {
    return (
      <div>
        <SensorTable />
      </div>
    );
  }
}

export default App;
```

Nyt sovelluksen ulkonäkö muuttui! http://localhost:3000

### Haetaan sensoreiden tiedot rajapinnasta

Lisätään sensorin tyyppimäärittely `types.d.ts`-tiedostoon.
```TypeScript
interface Sensor {
  name: string,
  firstonline: string,
  lastonline: string
}
```

Lisätään `package.json`-tiedostoon proxy-kenttä.
```
  ...
  "proxy": "http://localhost:3001"
}
```

Tehdään ajastettu rajapintakysely SensorTable-komponenttiin.

```TypeScript
import React, { Component } from 'react';

interface State {
  data: Sensor[]
}

class SensorTable extends Component<{}, State> {
  state = {
    data: []
  };

  async fetchSensors() {
    const response = await fetch('/api/getsensors');
    const data: Sensor[] = await response.json();
    this.setState({ data })
  }

  componentDidMount() {
    this.fetchSensors();
    setInterval(this.fetchSensors, 3000); // 3 seconds
  }

  render() {
    const { data } = this.state;

    if (data.length === 0) {
      return 'Ladataan...'
    }

    return 'Data vastaanotettu!'
  }
}

export default SensorTable;

```

Nyt komponentti hakee itselleen dataa rajapinnasta.


