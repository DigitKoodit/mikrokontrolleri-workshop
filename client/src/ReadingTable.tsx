import React from 'react';
import { Table } from 'react-bootstrap';

interface Props {
  isLoading: boolean,
  data: Reading[],
  error: any
}

const ReadingTable = ({ isLoading, data, error }: Props) => (
  <Table>
    {
      error
        ? error
        : (
          <>
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
                  <td>{formatDate(timestamp)}</td>
                  <td>{sensorname}</td>
                  <td>{temperature} °C</td>
                  <td>{pressure} hPa</td>
                  <td>{humidity} %</td>
                </tr>
              ))
            }
            </tbody>
          </>
        )
    }
  </Table>
);

const formatDate = (date: string): string =>
  new Date(date).toLocaleString('fi-FI');

export default ReadingTable;
