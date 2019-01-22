import React, { Component } from 'react';
import { Grid, Row, Col, Panel } from 'react-bootstrap';

import SensorTable from './SensorTable';
import ReadingTable from './ReadingTable';

class App extends Component {
  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <Panel className={"mb-4"}>
              <Panel.Heading>Sensorit</Panel.Heading>
              <Panel.Body>
                <SensorTable />
              </Panel.Body>
            </Panel>
          </Col>
          <Col xs={12}>
            <Panel className={"mb-4"}>
              <Panel.Heading>Mittaukset</Panel.Heading>
              <Panel.Body>
                <ReadingTable />
              </Panel.Body>
            </Panel>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default App;
