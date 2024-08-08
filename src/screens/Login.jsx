import React, { useState } from 'react';
import { Input } from '../components';
import { Button, TextField, FormControl, InputLabel } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../config/config';
import { LoadingButton } from '@mui/lab';
import { doc, getDoc } from 'firebase/firestore';
import header from '../resources/top-header.png';
import clg from '../resources/clg.png';

function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const validate = async (e) => {
        e.preventDefault();
        setLoading(true);
        let userEmail = e.target.userName.value;
        let password = e.target.password.value;

        try {
            const res = await signInWithEmailAndPassword(auth, userEmail, password);
            const uid = res.user.uid;

            // Fetch user role from Firestore
            const userDoc = await getDoc(doc(db, 'Users', uid));
            const userRole = userDoc.data().role;

            setLoading(false);

            if (userRole === 'admin') {
                navigate('/Home');
            } else {
                navigate('/student-home'); // Navigate to student home page
            }
        } catch (err) {
            setLoading(false);
            alert(err.message);
        }
    };

    return (
        <div className='login-container'>
            <form className='login-div' onSubmit={validate}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid lightgray' }}>
                    <img src={header} style={{ height: 80, padding: 10 }} alt="Header" />
                    <img src={clg} style={{ height: 100 }} alt="College" />
                </div>
                <div style={{ flexDirection: 'column', display: 'flex', width: '40vw', alignSelf: 'center', margin: 60 }}>
                    <h1 style={{ textAlign: 'center', margin: 0 }}>Login</h1>
                    <p style={{ textAlign: 'center', color: 'gray' }}>Sign in using your registered credentials</p>
                    <Input label="Username" name="userName" variant="filled" required={true} />
                    <Input label="Password" name="password" type="password" variant="filled" required={true} />
                    <LoadingButton loading={loading} variant='contained' disableElevation style={{ padding: 14 }} type="submit">Login</LoadingButton>
                    <Link to="/Forgot" style={{ textAlign: 'right', marginTop: 20 }}>Forgot Password?</Link>
                    <Link to="/Register" style={{ textAlign: 'center', marginTop: 20 }}>Create an account</Link>
                </div>
            </form>
        </div>
    );
}

export default Login;
