import React, { useState } from 'react';
import { Button, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../config/config';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import header from '../resources/top-header.png';
import clg from '../resources/clg.png';

function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState('student');

  const handleRegisterForm = async (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;
    const name = event.target.fullName.value;
    const mobile = event.target.mobile.value;

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const uid = res.user.uid;

      await updateProfile(auth.currentUser, { displayName: name });
      await saveUserinDB(name, uid, email, mobile, role);
      
      toast.success('User created successfully!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate(role === 'admin' ? '/admin-home' : '/student-home', { replace: true });
    } catch (error) {
      console.error('Error during registration:', error);
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const saveUserinDB = async (name, userId, email, mobile, role) => {
    const userObj = {
      name,
      id: userId,
      email,
      mobile,
      role,
      createdAt: serverTimestamp(),
    };

    try {
      await setDoc(doc(db, 'Users', userId), userObj);
    } catch (error) {
      console.error('Error saving user in DB:', error);
      throw new Error('Could not save user data');
    }
  };

  return (
    <div>
      <ToastContainer />
      <form className='d-f f-d-c f-1' onSubmit={handleRegisterForm}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid lightgray', paddingBottom: '10px' }}>
          <img src={header} style={{ height: 80, padding: 10 }} alt="Header" />
          <img src={clg} style={{ height: 100 }} alt="College" />
        </div>
        <div className='d-f f-d-c' style={{ width: '40vw', alignSelf: 'center', margin: '60px 0' }}>
          <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Register</h1>
          <TextField label="Full Name" name="fullName" required variant="filled" style={{ marginBottom: '20px' }} />
          <TextField label="Email" name="email" required variant="filled" type="email" style={{ marginBottom: '20px' }} />
          <TextField label="Mobile" name="mobile" required variant="filled" type="number" style={{ marginBottom: '20px' }} />
          <TextField label="Password" name="password" required variant="filled" type="password" style={{ marginBottom: '20px' }} />
          <FormControl variant="filled" required style={{ marginBottom: '20px' }}>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              name="role"
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <Button type='submit' variant='contained' disableElevation style={{ padding: '14px', marginBottom: '20px' }}>Register</Button>
          <Link to="/" style={{ textAlign: 'center', display: 'block' }}>Already have an account?</Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
