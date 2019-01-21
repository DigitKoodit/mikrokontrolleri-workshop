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
    setInterval(this.fetchSensors, 3000); // 3 seconds
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
