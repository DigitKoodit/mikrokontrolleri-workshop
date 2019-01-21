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
