// src/pages/AdminAttendance.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/config';
import { Container, Typography, Box, List, ListItem, ListItemText } from '@mui/material';

function AdminAttendance() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'attendance'));
        const attendanceList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAttendanceRecords(attendanceList);
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
          Attendance Records of All Students
        </Typography>
        <List>
          {attendanceRecords.map((record) => (
            <ListItem key={record.id}>
              <ListItemText primary={`Student ID: ${record.id}`} secondary={`Attended: ${record.attended ? 'Yes' : 'No'} | Date: ${record.timestamp}`} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
}

export default AdminAttendance;
