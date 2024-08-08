import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { collection, getDocs, doc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/config';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getAuth } from 'firebase/auth';

function QuestionList() {
  const [questions, setQuestions] = useState([]);
  const [editQuestion, setEditQuestion] = useState(null);
  const [open, setOpen] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newAnswerText, setNewAnswerText] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const contentRef = useRef(); // Initialize useRef
  const auth = getAuth();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const collectionRef = collection(db, 'questions');
        const querySnapshot = await getDocs(collectionRef);
        const questionsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setQuestions(questionsList);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    const checkUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'Users', user.uid)); // Use getDoc with DocumentReference
        setIsAdmin(userDoc.data().role === 'admin');
      }
    };

    fetchQuestions();
    checkUserRole();
  }, [auth]);

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    try {
      await deleteDoc(doc(db, 'questions', id));
      setQuestions(questions.filter(question => question.id !== id));
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const handleEdit = (question) => {
    if (!isAdmin) return;
    setEditQuestion(question);
    setNewQuestionText(question.question);
    setNewAnswerText(question.answer);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditQuestion(null);
    setNewQuestionText('');
    setNewAnswerText('');
  };

  const handleUpdate = async () => {
    try {
      const questionRef = doc(db, 'questions', editQuestion.id);
      await updateDoc(questionRef, {
        question: newQuestionText,
        answer: newAnswerText,
      });
      setQuestions(questions.map(q => q.id === editQuestion.id ? { ...q, question: newQuestionText, answer: newAnswerText } : q));
      handleClose();
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  const downloadPDF = () => {
    const input = contentRef.current;
    html2canvas(input, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('question-bank.pdf');
    });
  };

  return (
    <Container>
      <Box my={4} ref={contentRef}>
        <Typography variant="h4" align="center" gutterBottom>
          Question Bank
        </Typography>
        <List>
          {questions.map((question) => (
            <ListItem key={question.id} divider>
              <ListItemText
                primary={
                  <>
                    <Typography variant="h6">Question</Typography>
                    <Typography variant="body1">{question.question}</Typography>
                  </>
                }
                secondary={
                  <>
                    <Typography variant="h6">Answer</Typography>
                    <Typography variant="body1">{question.answer}</Typography>
                  </>
                }
              />
              {isAdmin && (
                <>
                  <Button variant="outlined" color="primary" onClick={() => handleEdit(question)} style={{ marginLeft: '20px' }}>
                    Update
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={() => handleDelete(question.id)} style={{ marginLeft: '10px' }}>
                    Delete
                  </Button>
                </>
              )}
            </ListItem>
          ))}
        </List>
        <Box mt={4} textAlign="center">
          <Button variant="contained" color="primary" onClick={downloadPDF}>
            Download PDF
          </Button>
        </Box>
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

export default QuestionList;
