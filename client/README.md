
# Etupää =D

### 1. Luodaan React-appis

Navigoi takaisin projektin juureen ja aja siellä:

```
create-react-app client --typescript
cd client
yarn start
```

Selaimella http://localhost:3000 löytyy nyt uusi sivu.

Sinulla on nyt toimivan React-appiksen runko. Onnittelut!

Create-react-app loi paljon tiedostoja mutta suurimmasta osasta ei tarvitse välittää.

### 2. Luodaan uusi SensorTable komponentti

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

### 3. Haetaan sensoreiden tiedot rajapinnasta

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
    this.setState({ data });
  }

  componentDidMount() {
    this.fetchSensors();
    setInterval(this.fetchSensors.bind(this), 3000); // 3 seconds
  }

  render() {
    const { data } = this.state;

    if (data.length === 0) {
      return 'Ladataan...';
    }

    return 'Data vastaanotettu!';
  }
}

export default SensorTable;

```

Nyt komponentti hakee itselleen dataa rajapinnasta.

### 4. Toteutetaan sensoreiden listaus taulukkona

Asennetaan react-bootstrap helpottamaan tyylittelyä.
```
yarn add react-bootstrap @types/react-bootstrap
```

Lisätään CSS-tyylien importtaus `index.html`-tiedostoon.
```html
...
    <title>React App</title>
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

    <!-- Optional theme -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">
    ...
```

Muoksitaan sisään tullut data siistiksi tauluksi.

```TypeScript
import React, { Component } from 'react'; 
import { Table } from 'react-bootstrap';

  ...

  formatDate(date: string): string {
    return new Date(date).toLocaleString('fi-FI');
  }

  render() {
    const { data } = this.state;

    if (data.length === 0) {
      return 'Ladataan...';
    }

    return (
      <Table>
        <thead>
          <tr>
            <th>Nimi</th>
            <th>Ensimmäinen viesti</th>
            <th>Viimeisin viesti</th>
          </tr>
        </thead>
        <tbody>
        {
          data.map(({ name, firstonline, lastonline }) => (
            <tr key={name}>
              <td>{name}</td>
              <td>{this.formatDate(firstonline)}</td>
              <td>{this.formatDate(lastonline)}</td>
            </tr>
          ))
        }
        </tbody>
      </Table>
    );
  }
}
```

Nyt ruudulle piirtyy tosi siisti taulu.

### 5. Tyylitellään koko äppi kivammin react-bootstrapilla

Lisätään `app.tsx`-tiedostoon react-bootstrap elementtejä.

```TypeScript
import React, { Component } from 'react';
import { Grid, Row, Col, Panel } from 'react-bootstrap';

import SensorTable from './SensorTable';

class App extends Component {
  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <Panel>
              <Panel.Heading>Sensorit</Panel.Heading>
              <Panel.Body>
                <SensorTable />
              </Panel.Body>
            </Panel>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default App;
```

### 6. Luodaan mitta-arvoille kuvaajat

Koodataan uusi komponentti `ReadingGraphs.tsx`.


