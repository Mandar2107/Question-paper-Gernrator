import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/config';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function AdminAddQuestion() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const navigate = useNavigate();

  const handleAddQuestion = async (event) => {
    event.preventDefault();
    if (!question || !answer) {
      toast.error('Please fill in both fields.');
      return;
    }

    try {
      const questionRef = collection(db, 'questions'); // Get a reference to the 'questions' collection
      await addDoc(questionRef, {
        question,
        answer,
        createdAt: serverTimestamp(),
      });
      setQuestion('');
      setAnswer('');
      toast.success('Question added successfully!');
      navigate('/screens/QuestionList'); // Navigate to QuestionList after adding the question
    } catch (error) {
      console.error('Error adding question:', error);
      toast.error('Failed to add question. Please try again.');
    }
  };

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" align="center" gutterBottom>
          Add Question to Question Bank
        </Typography>
        <form onSubmit={handleAddQuestion}>
          <TextField
            label="Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Add Question
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default AdminAddQuestion;
