import React, { Component } from 'react';
import { Table } from 'react-bootstrap';

interface State {
  data: Reading[]
}

class ReadingTable extends Component<{}, State> {
  state = {
    data: []
  };

  async fetchReadings() {
    const response = await fetch('/api/getreadings');
    const data: Reading[] = await response.json();
    this.setState({ data });
  }

  componentDidMount() {
    this.fetchReadings();
    setInterval(this.fetchReadings.bind(this), 3000); // 3 seconds
  }

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
          <th>Aika</th>
          <th>Sensori</th>
          <th>Lämpötila</th>
          <th>Ilmanpaine</th>
          <th>Ilmankosteus</th>
        </tr>
        </thead>
        <tbody>
        {
          data.map(({ sensorname, temperature, pressure, humidity, timestamp }) => (
            <tr key={`${sensorname}-${timestamp}`}>
              <td>{this.formatDate(timestamp)}</td>
              <td>{sensorname}</td>
              <td>{temperature} °C</td>
              <td>{pressure} hPa</td>
              <td>{humidity} %</td>
            </tr>
          ))
        }
        </tbody>
      </Table>
    );
  }
}

export default ReadingTable;
