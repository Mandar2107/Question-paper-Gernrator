import { Button } from '@mui/material'
import { sendPasswordResetEmail } from 'firebase/auth'
import React from 'react'
import { Input } from '../components'
import { auth } from '../config/config'

function ForgotPassword() {

    const handleSubmitForm = (e) => {
        let email = e.target.email.value
        sendPasswordResetEmail(auth, email)
            .then(res => alert("Passowrd Link has sent!"))
            .catch(err => {
                alert(err.code)
            })
        e.preventDefault()
    }

    return (
        <form onSubmit={handleSubmitForm} >
            <div className="d-f a-i-c f-d-c  f-1" style={{height:'100vh', margin:100}}>
                <h1 style={{margin:0}}>Forgot Password</h1>
                <p>Enter your registed email address</p>
                <Input label="Email" name="email" required={1}  style={{width:'40vw',margin:10}} />
                <Button type="submit" variant='contained'>Send Link</Button>
            </div>
        </form>
    )
}

export default ForgotPassword
