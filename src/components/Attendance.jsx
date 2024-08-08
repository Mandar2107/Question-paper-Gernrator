// src/pages/Attendance.js
import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/config';

function Attendance() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        // Fetch all attendance records
        const querySnapshot = await getDocs(collection(db, 'attendance'));
        const records = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const data = doc.data();
            return { id: doc.id, ...data };
          })
        );
        setAttendanceRecords(records);
      } catch (error) {
        console.error('Error fetching attendance records:', error);
        setError('Failed to fetch attendance records. Please try again later.');
      }
    };

    fetchAttendance();
  }, []);

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" align="center" gutterBottom>
          Attendance Records
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Attended</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendanceRecords.map(record => (
                <TableRow key={record.id}>
                  <TableCell>{record.id}</TableCell>
                  <TableCell>{record.timestamp?.toDate().toLocaleString() || 'N/A'}</TableCell>
                  <TableCell>{record.attended ? 'Yes' : 'No'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}

export default Attendance;
