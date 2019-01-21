
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

### Esitetään sensorit taulukossa

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

```
import React, { Component } from 'react';

import SensorTable from './SensorTable';

class App extends Component {
  render() {
    return (
      <div>
        <SensorTable/>
      </div>
    );
  }
}

export default App;
```

Nyt sovelluksen ulkonäkö muuttui! http://localhost:3000
