import React from 'react';
import { Table } from 'react-bootstrap';

interface Props {
  isLoading: boolean,
  data: Sensor[],
  error: any
}

const SensorTable = ({ isLoading, data, error }: Props) => (
  <Table>
    {
      error
        ? error
        : (
          <>
            <thead>
              <tr>
                <th>Nimi</th>
                <th>Ensimmäinen viesti</th>
                <th>Viimeisin viesti</th>
              </tr>
            </thead>
            <tbody>
            {
              data.map(({name, firstonline, lastonline}) => (
                <tr key={name}>
                  <td>{name}</td>
                  <td>{formatDate(firstonline)}</td>
                  <td>{formatDate(lastonline)}</td>
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

export default SensorTable;
