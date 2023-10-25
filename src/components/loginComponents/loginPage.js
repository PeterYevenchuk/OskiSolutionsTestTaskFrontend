import React, { useState } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    const handleLoginFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5041/api/Auth/login', formData);
            const { accessToken, refreshToken } = response.data;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            navigate('/home');
        } catch (error) {
            setErrorMessage('Invalid credentials. Please check them and try again.');
        }
    };

    return (
        <Container fluid className="vh-100 d-flex justify-content-center align-items-center">
            <Row className="justify-content-center align-items-center h-100">
                <Col>
                    <Card>
                        <Card.Body>
                            <h1 className="text-center">Log In to Your Account</h1>
                            <Form onSubmit={handleLoginFormSubmit}>
                                <Form.Label>Username</Form.Label>
                                <Form.Group controlId="username">
                                    <Form.Control
                                        type="text"
                                        name="email"
                                        value={formData.email}
                                        placeholder="Enter your username"
                                        style={{ borderRadius: '8px', height: '30px', margin: '5px', marginBottom: '10px' }}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Label>Password</Form.Label>
                                <Form.Group controlId="password">
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        placeholder="Enter your password"
                                        style={{ borderRadius: '8px', height: '30px', margin: '5px', marginBottom: '20px' }}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
