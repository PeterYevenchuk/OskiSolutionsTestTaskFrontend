import React, { useState, useEffect } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../homeComponents/styles/homeStyles.css';
import axios from 'axios';
import Auth from '../jwtAuth/withAuth.js';
import jwt from 'jwt-decode';

const HomePage = () => {
  const [tests, setTests] = useState([]);
  const [filter, setFilter] = useState('all');
  const accessToken = Auth();
  const decodeToken = jwt(accessToken);
  const userId = decodeToken.nameid;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/');
  };

  useEffect(() => {
    let url = `http://localhost:5041/api/UserTestStatus/${userId}`;

    if (filter === 'passed') {
      url = `http://localhost:5041/api/UserTestStatus/is-passed/${userId}/true`;
  } else if (filter === 'not-passed') {
      url = `http://localhost:5041/api/UserTestStatus/is-passed/${userId}/false`;
  }

    axios.get(url, {
      headers: {
          Authorization: `Bearer ${accessToken}`,
      }
  })
  .then((response) => {
      setTests(response.data);
  })
  .catch((error) => {
      console.error('Error retrieving test list:', error);
  });
}, [filter, userId, accessToken]);

  const handleTestPassing = (test) => {
    console.log('Test passing:', test);
  };

  return (
    <Container>
      <div className="d-flex justify-content-between">
        <h1>List of tests</h1>
        <Button variant="danger" type="submit" onClick={handleLogout} className="w-100" style={{ borderRadius: '8px', height: '30px', margin: '5px' }}>Logout</Button>
      </div>
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="all">All Tests</option>
        <option value="passed">Passed Tests</option>
        <option value="not-passed">Not Passed Tests</option>
      </select>
      {tests.map((test, index) => (
        <div key={index}>
          {index === 0 && <hr />}
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h2>{test.testResponse.name}</h2>
                  <p>{test.testResponse.description}</p>
                </div>
                <div className="d-flex align-items-end">
                  <div className="mr-2">
                    <span>Rating: {test.rating} / {test.maxRaiting}</span>
                  </div>
                  <div>
                  <span className={`mr-2 ${test.testResponse.passed ? 'text-success' : 'text-danger'}`}>
                      {test.testResponse.passed ? 'Passed' : 'Not passed'}
                    </span>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => handleTestPassing(test)}
                    disabled={test.testResponse.passed}
                  >
                    Pass
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      ))}
    </Container>
  );
};

export default HomePage;
