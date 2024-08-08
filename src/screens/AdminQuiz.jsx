import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { collection, getDocs, doc, deleteDoc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../config/config';
import { getAuth } from 'firebase/auth';

function AdminQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [editQuiz, setEditQuiz] = useState(null);
  const [open, setOpen] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newAnswerText, setNewAnswerText] = useState('');
  const [quizTitle, setQuizTitle] = useState('');

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

  const handleDeleteQuiz = async (id) => {
    try {
      await deleteDoc(doc(db, 'quizzes', id));
      setQuizzes(quizzes.filter(quiz => quiz.id !== id));
    } catch (error) {
      console.error('Error deleting quiz:', error);
    }
  };

  const handleDeleteQuestion = async (quizId, questionId) => {
    try {
      await deleteDoc(doc(db, 'quizzes', quizId, 'questions', questionId));
      setQuestions(questions.filter(question => question.id !== questionId));
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const handleEdit = (quiz) => {
    setEditQuiz(quiz);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditQuiz(null);
    setNewQuestionText('');
    setNewAnswerText('');
  };

  const handleAddQuiz = async () => {
    try {
      const quizRef = await addDoc(collection(db, 'quizzes'), { title: quizTitle });
      setQuizzes([...quizzes, { id: quizRef.id, title: quizTitle }]);
      setQuizTitle('');
    } catch (error) {
      console.error('Error adding quiz:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const questionRef = doc(db, 'quizzes', editQuiz.id, 'questions', newQuestionText);
      await updateDoc(questionRef, {
        question: newQuestionText,
        answer: newAnswerText,
      });
      setQuestions(questions.map(q => q.id === newQuestionText ? { ...q, question: newQuestionText, answer: newAnswerText } : q));
      handleClose();
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" align="center" gutterBottom>
          Admin Quiz Management
        </Typography>
        <TextField
          label="Quiz Title"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
        />
        <Button onClick={handleAddQuiz}>Add Quiz</Button>
        <List>
          {quizzes.map((quiz) => (
            <ListItem key={quiz.id} divider>
              <ListItemText primary={quiz.title} />
              <Button onClick={() => handleEdit(quiz)}>Edit</Button>
              <Button onClick={() => handleDeleteQuiz(quiz.id)}>Delete</Button>
            </ListItem>
          ))}
        </List>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update Question</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update the question and answer below:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Question"
            type="text"
            fullWidth
            value={newQuestionText}
            onChange={(e) => setNewQuestionText(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Answer"
            type="text"
            fullWidth
            value={newAnswerText}
            onChange={(e) => setNewAnswerText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default AdminQuiz;
