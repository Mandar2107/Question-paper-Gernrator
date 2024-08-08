// src/pages/StudentHome.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { AppBar, Toolbar, Typography, Button, Container, Box, Grid, Card, CardContent } from '@mui/material';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/config';
import { toast } from 'react-toastify';

function StudentHome() {
  const [userName, setUserName] = useState('');
  const currentUser = { uid: 'studentUID' }; // replace with actual user ID
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const name = localStorage.getItem('userName');
    if (name) {
      setUserName(name);
    }
  }, []);

  const markAttendance = async () => {
    try {
      const attendanceRef = doc(db, 'attendance', currentUser.uid);
      await setDoc(attendanceRef, {
        attended: true,
        timestamp: serverTimestamp(),
      }, { merge: true }); // Merge to keep previous attendance records

      toast.success('Attendance marked successfully!');
      
      // Navigate to StudentAttendance page after marking attendance
      navigate('/attendance'); // Add this line to navigate to the attendance page
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast.error('Failed to mark attendance.');
    }
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Student Portal
          </Typography>
          <Button color="inherit" component={Link} to="/question-bank">Question Bank</Button>
          <Button color="inherit" component={Link} to="/profile1">Profile</Button>
          <Button color="inherit" component={Link} to="/attendance">Attendance</Button> {/* Add Attendance link */}
          <Button color="inherit" component={Link} to="/Login">Logout</Button> {/* Add Attendance link */}
        </Toolbar>
      </AppBar>
      <Container>
        <Box my={4}>
          <Typography variant="h3" align="center" gutterBottom>
            Welcome, Student !
          </Typography>
          <Typography variant="h5" align="center" color="textSecondary" paragraph>
            Access your question bank and profile easily from here.
          </Typography>
          <Button variant="contained" color="primary" onClick={markAttendance}>
            Mark Attendance
          </Button>
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">
                  Question Bank
                </Typography>
                <Typography color="textSecondary">
                  Access and review all your questions here.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  component={Link} 
                  to="/question-bank" 
                  style={{ marginTop: '1rem' }}
                >
                  Go to Question Bank
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">
                  Profile
                </Typography>
                <Typography color="textSecondary">
                  View and edit your profile information.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  component={Link} 
                  to="/profile1" 
                  style={{ marginTop: '1rem' }}
                >
                  Go to Profile
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default StudentHome;
