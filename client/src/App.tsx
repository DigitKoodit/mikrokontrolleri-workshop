import React, { Component } from 'react';
import { Grid, Row, Col, Panel } from 'react-bootstrap';

import SensorTable from './SensorTable';
import ReadingTable from './ReadingTable';

interface State {
  sensors: {
    isLoading: boolean,
    data: Sensor[],
    error: any
  },
  readings: {
    isLoading: boolean,
    data: Reading[],
    error: any
  }
}

class App extends Component<{}, State> {
  state = {
    sensors: {
      isLoading: true,
      data: [],
      error: null
    },
    readings: {
      isLoading: true,
      data: [],
      error: null
    }
  };

  componentDidMount() {
    this.fetchSensors();
    this.fetchReadings();
    setInterval(this.fetchSensors.bind(this), 3000); // 3 seconds
    setInterval(this.fetchReadings.bind(this), 3000); // 3 seconds
  }

  async fetchSensors() {
    try {
      const response = await fetch('/api/getsensors');

      if (!response.ok) {
        throw Error(response.statusText)
      }

      const data: Sensor[] = await response.json();
      this.setState({
        sensors: {
          isLoading: false,
          data,
          error: null
        }
      });
    }
    catch (error) {
      this.setState({
        sensors: {
          isLoading: false,
          data: [],
          error: error.toString()
        }
      })
    }
  }

  async fetchReadings() {
    try {
      const response = await fetch('/api/getreadings/100');

      if (!response.ok) {
        throw Error(response.statusText)
      }

      const data: Reading[] = await response.json();
      this.setState({
        readings: {
          isLoading: false,
          data,
          error: null
        }
      });
    }
    catch (error) {
      this.setState({
        readings: {
          isLoading: false,
          data: [],
          error: error.toString()
        }
      })
    }
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <Panel className={"mb-4"}>
              <Panel.Heading>
                <h4>Sensorit</h4>
              </Panel.Heading>
              <Panel.Body>
                <SensorTable {...this.state.sensors} />
              </Panel.Body>
            </Panel>
          </Col>
          <Col xs={12}>
            <Panel className={"mb-4"}>
              <Panel.Heading>
                <h4>Mittaukset</h4>
              </Panel.Heading>
              <Panel.Body>
                <ReadingTable {...this.state.readings} />
              </Panel.Body>
            </Panel>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default App;
