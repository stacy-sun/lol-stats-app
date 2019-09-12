import React, { useState } from 'react';
import { Container, Row, Col, Button, Input } from 'reactstrap';
import './styles/style.scss';
import { BASE_URL } from './index';
import loadingImg from './images/loading.gif';

// Components
import MatchResult from './components/MatchResult';

const App = () => {
  const [name, setName] = useState('')
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getData = async () => {
    if (name) {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}/?name=${name}`);
        const resData = await res.json();
        setResults(resData.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setError('There is an error occured.');
      }
    } else {
      setError('Required');
    }
  }

  return (
    <Container>
      <Row>
        <Col sm={{ size: 6, offset: 3 }} className="header-container">
          <h1>League Stats</h1>
          <div className="search-container">
            <Input
              type="text"
              onChange={e => {
                setName(e.target.value);
                setResults([]);
              }}
            />
            <Button onClick={getData} color="primary">Submit</Button>
          </div>
          {error && <p>{error}</p>}
        </Col>
        <Col sm="12">
          {isLoading ?
            <div className="loading-container">
              <img src={loadingImg} alt="loading" />
              <p>Loading...</p>
            </div>
            : null}
          {results.length ? results.map((result, index) => <MatchResult key={index} result={result} />) : null}
        </Col>
      </Row>
    </Container>
  );
}


export default App;
