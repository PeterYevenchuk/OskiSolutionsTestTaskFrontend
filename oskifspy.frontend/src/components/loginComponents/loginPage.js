import React, { useState } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuth from '../jwtAuth/withAuth';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    
    const history = useNavigate();
    const { auth } = useAuth() || {};
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    
    const [errorMessage, setErrorMessage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post('http://localhost:5041/api/Auth/login', formData);

        const { accessToken, refreshToken } = response.data;
        
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        auth(accessToken);
        history('/home');
    } catch (error) {
      console.error('Authorization error:', error);
      if (error.response.data.detail.includes('length')) {
        setErrorMessage('Wrong credentials!');
      } else {
        setErrorMessage(error.response.data.detail);
      }
    }
  };

  return (
    <Container fluid className="vh-100 d-flex justify-content-center align-items-center">
      <Row className="justify-content-center align-items-center h-100">
        <Col>
          <Card>
            <Card.Body>
              <h1 className="text-center">Log In to Your Account</h1>
              <Form onSubmit={handleSubmit}>
                <Form.Label>Username</Form.Label>
                <Form.Group controlId="username">
                  <Form.Control
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    style={{ borderRadius: '8px', height: '30px', margin: '5px', marginBottom: '10px' }}
                  />
                </Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Group controlId="password">
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    style={{ borderRadius: '8px', height: '30px', margin: '5px', marginBottom: '20px' }}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100" style={{ borderRadius: '8px', height: '30px', margin: '5px' }}>
                  Log In
                </Button>
              </Form>
              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
