import React, {useState, useEffect} from 'react';
import { DropdownButton, Button, Dropdown, Container, Col, Row, Table, Alert } from 'react-bootstrap';
import './App.css';

function App() {
  const [dropdownValue, setDropdownValue] = useState('amount'); //dropdown value reference
  const [priceType, setpriceType] = useState('amount'); //table's column name
  const [order, setOrder] = useState('asc'); //order value reference
  const [tableRows, setTableRows] = useState([]); //table's content data

  useEffect(() => {
    const endpoint = 'https://api.deversifi.com/v1/pub/tokenRanking/ETH?fbclid=IwAR0XiEJQUVFxmUdCPaIq4q7CgmDN5o4tCzP3NLulYLWgxoZxksN1Rg_Bbvc';
  
    fetch(endpoint)
      .then(res => res.json())
      .then(
        (success) => setTableRows(success.sort((a, b) => a.amount - b.amount)),
        (error) => console.err(error)
      );
  }, []);

  const sortData = () => {
    const newTableRows = [...tableRows].sort().reverse();
    const newOrder = order === 'asc' ? 'desc' : 'asc';
    setTableRows(newTableRows);
    setOrder(newOrder);
  }

  const updateData = () => {
    setpriceType(dropdownValue);
    const endpoint = dropdownValue === 'amount' ? 
      'https://api.deversifi.com/v1/pub/tokenRanking/ETH?fbclid=IwAR0XiEJQUVFxmUdCPaIq4q7CgmDN5o4tCzP3NLulYLWgxoZxksN1Rg_Bbvc' :
      'https://api.deversifi.com/v1/pub/USDRanking?fbclid=IwAR2ZQdiSMV8sEIT-p3WVlSE-nJE-Ln99390UXxxGjwG1chuQV0WGK9zgAuw';
    fetch(endpoint)
      .then(res => res.json())
      .then(
        (success) => setTableRows(success.sort((a, b) => order === 'asc' ? a.amount - b.amount : a.amount + b.amount)),
        (error) => console.err(error)
      );
  }

  const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

  return (
    <Container fluid={true} className="mt-5">
      <Row>
        <Col xs={6} md={4} className="text-center">
          <DropdownButton variant="info" id="dropdown-basic-button" title={'Price Type: ' + capitalizeFirstLetter(dropdownValue)}>
            <Dropdown.Item as="button" disabled={priceType === 'amount' ? true : false} onClick={() => setDropdownValue('amount')}>Amount</Dropdown.Item>
            <Dropdown.Item as="button" disabled={priceType === 'usd' ? true : false} onClick={() => setDropdownValue('usd')}>USD</Dropdown.Item>
          </DropdownButton>
        </Col>
        <Col xs={6} md={4} className="text-center border-md-right">
          <Button onClick={updateData} disabled={priceType === dropdownValue ? true : false} variant="success">Update data</Button> <br />
          <Alert variant="success" className={priceType !== dropdownValue ? 'display-none' : 'mt-2'}>
            To enable the update button, select a different Price Type.
          </Alert>
        </Col>
        <Col xs={12} md={4} className="text-center mt-2 mt-md-0">
          <Button onClick={() => sortData()} variant="warning">Sort data: {capitalizeFirstLetter(order)}</Button>
        </Col>
        <Col xs={12} className="mt-5">
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Address</th>
                <th>{priceType === 'amount' ? 'amount' : 'usd'}</th>
              </tr>
            </thead>
            <tbody>
              {
                tableRows.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{index}</td>
                      <td>{item.address}</td>
                      <td>{priceType === 'amount' ? item.amount : item.USDValue}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
