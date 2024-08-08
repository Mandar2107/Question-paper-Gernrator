// src/pages/StudentAttendance.js
import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/config';

function StudentAttendance() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const currentUser = { uid: 'studentUID' }; // replace with actual user ID

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const docRef = doc(db, 'attendance', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          // Assuming docSnap.data() returns an array of records
          setAttendanceRecords([docSnap.data()]); // Wrap in an array if needed
        } else {
          console.log('No attendance data found');
        }
      } catch (error) {
        console.error('Error fetching attendance:', error);
      }
    };

    fetchAttendance();
  }, []);

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" align="center" gutterBottom>
          Your Attendance Records
        </Typography>
        <List>
          {attendanceRecords.map((record, index) => (
            <ListItem key={index}>
              <ListItemText 
                primary={`Attended: ${record.attended ? 'Yes' : 'No'}`} 
                secondary={`Date: ${new Date(record.timestamp.seconds * 1000).toLocaleString()}`} 
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
}

export default StudentAttendance;
