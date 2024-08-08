import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Button, TextField } from '@mui/material';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../config/config';
import { getAuth } from 'firebase/auth';

function StudentQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'quizzes'));
        const quizzesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setQuizzes(quizzesList);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };

    fetchQuizzes();
  }, []);

  const handleSelectQuiz = async (quizId) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'quizzes', quizId, 'questions'));
      const questionsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSelectedQuiz({ id: quizId, questions: questionsList });
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = async () => {
    try {
      const answersRef = doc(collection(db, 'quizzes', selectedQuiz.id, 'submissions'), user.uid);
      await setDoc(answersRef, { answers });
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting answers:', error);
    }
  };

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" align="center" gutterBottom>
          Take a Quiz
        </Typography>
        {submitted ? (
          <Typography variant="h6" align="center">
            Your answers have been submitted!
          </Typography>
        ) : (
          <>
            <List>
              {quizzes.map((quiz) => (
                <ListItem key={quiz.id} divider>
                  <ListItemText primary={quiz.title} />
                  <Button onClick={() => handleSelectQuiz(quiz.id)}>Take Quiz</Button>
                </ListItem>
              ))}
            </List>
            {selectedQuiz && (
              <Box mt={4}>
                <Typography variant="h5" gutterBottom>
                  {selectedQuiz.title}
                </Typography>
                {selectedQuiz.questions.map((question) => (
                  <Box key={question.id} mb={3}>
                    <Typography variant="h6">{question.question}</Typography>
                    <TextField
                      fullWidth
                      value={answers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    />
                  </Box>
                ))}
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                  Submit
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </Container>
  );
}

export default StudentQuiz;
