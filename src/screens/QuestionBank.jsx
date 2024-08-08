// src/pages/QuestionBank.js
import React, { useState, useEffect } from 'react';
import { db } from '../config/config';
import { collection, getDocs } from 'firebase/firestore';
import { Container, Typography, Box, Grid, Card, CardContent } from '@mui/material';

function QuestionBank() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const querySnapshot = await getDocs(collection(db, 'questions'));
      const questionsData = querySnapshot.docs.map(doc => doc.data());
      setQuestions(questionsData);
    };

    fetchQuestions();
  }, []);

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" align="center" gutterBottom>
          Question Bank
        </Typography>
        <Grid container spacing={4}>
          {questions.map((question, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {question.question}
                  </Typography>
                  <Typography color="textSecondary">
                    {question.answer}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

export default QuestionBank;
