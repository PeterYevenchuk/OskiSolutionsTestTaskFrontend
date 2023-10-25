import React, { useState, useEffect } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Auth from '../jwtAuth/withAuth.js';
import jwt from 'jwt-decode';

const TestPage = () => {
  const [test, setTest] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const accessToken = Auth();
  const decodeToken = jwt(accessToken);
  const userId = decodeToken.nameid;
  const navigate = useNavigate();
  const { testId } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:5041/api/Test/${testId}/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setTest(response.data);
      })
      .catch((error) => {
        console.error('Error retrieving the test:', error);
      });
  }, [testId, userId, accessToken]);

  const handleAnswerSelect = (questionId, answerId) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answerId,
    }));
  };

  const handleSubmitTest = () => {
    const allQuestionsAnswered = test.questions.every(
      (question) => selectedAnswers[question.questionResponse.questionId]
    );

    if (allQuestionsAnswered) {
      axios.post('http://localhost:5041/api/Test/passing-test', {
        userId,
        testId,
        questionAndAnswer: selectedAnswers,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(() => {
        navigate('/home');
      })
      .catch((error) => {
        console.error('Error submitting the test:', error);
      });
    } else {
      alert('Please answer all questions before submitting the test.');
    }
  };

  if (!test) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <div className="d-flex justify-content-between">
        <Button
          variant="danger"
          onClick={() => navigate('/home')}
          className="w-100"
          style={{ borderRadius: '8px', height: '30px', margin: '5px' }}
        >
          Go Back
        </Button>
      </div>
      <h1>{test.testResponse.name}</h1>
      <p>{test.testResponse.description}</p>
      <div>
        {test.questions.map((question) => (
          <Card key={question.questionResponse.questionId}>
            <Card.Body>
              <h5>{question.questionResponse.questionText}</h5>
              {question.answers.map((answer) => (
                <div key={answer.answerId}>
                  <input
                    type="radio"
                    name={`question_${question.questionResponse.questionId}`}
                    value={answer.answerId}
                    onChange={() =>
                      handleAnswerSelect(
                        question.questionResponse.questionId,
                        answer.answerId
                      )
                    }
                    checked={
                      selectedAnswers[question.questionResponse.questionId] === answer.answerId
                    }
                  />
                  {answer.answerText}
                </div>
              ))}
            </Card.Body>
          </Card>
        ))}
      </div>
      <Button variant="primary" onClick={handleSubmitTest}>
        Submit Test
      </Button>
    </Container>
  );
};

export default TestPage;
