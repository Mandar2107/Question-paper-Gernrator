// src/components/Navbar.js
import React, { useEffect, useRef } from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

function Navbar() {
  const navigate = useNavigate();
  const auth = getAuth();
  const navbarRef = useRef(null);

  const handleLogout = () => {
    signOut(auth)
      .then(() => navigate('/'))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    const animateBackground = () => {
      const colors = ['#3f51b5', '#303f9f', '#1a237e', '#0d47a1'];
      let currentColorIndex = 0;

      setInterval(() => {
        if (navbarRef.current) {
          navbarRef.current.style.backgroundColor = colors[currentColorIndex];
          currentColorIndex = (currentColorIndex + 1) % colors.length;
        }
      }, 3000); // Change color every 3 seconds
    };

    animateBackground();
  }, []);

  return (
    <AppBar ref={navbarRef} position="static" style={{ transition: 'background-color 1s ease-in-out' }}>
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Question Paper Generator
        </Typography>
        <nav style={{ display: 'flex', gap: '20px' }}>
          <Link className="nav-link" to="/screens/Dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>Dashboard</Link>
          <Link className="nav-link" to="/admin-add-question" style={{ color: 'inherit', textDecoration: 'none' }}>Add Question</Link>
          <Link className="nav-link" to="/screens/QuestionList" style={{ color: 'inherit', textDecoration: 'none' }}>Question Bank</Link>
          <Link className="nav-link" to="/attendance" style={{ color: 'inherit', textDecoration: 'none' }}>Attendance</Link>
          <Link className="nav-link" to="/" onClick={handleLogout} style={{ color: 'inherit', textDecoration: 'none' }}>Logout</Link>
        </nav>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
