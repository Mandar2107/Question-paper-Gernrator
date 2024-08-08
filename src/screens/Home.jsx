// src/pages/Home.js
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import Navbar from '../components/Navbar';

function Home() {
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Navbar />
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        <Outlet />
      </div>
    </div>
  );
}

export default Home;
