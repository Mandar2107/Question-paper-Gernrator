import { Button } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '../components'
import '../style/style.css'
import { HomeRounded } from '@mui/icons-material'
import { doc, updateDoc, onSnapshot, getDoc } from 'firebase/firestore'
import { auth, db, storage } from '../config/config'
import { updatePassword, signOut } from 'firebase/auth'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import avtar from '../resources/avtar.png'
import { toast } from 'react-toastify';

function Profile1() {
    const [user, setUser] = useState({})
    const [pass, setPass] = useState(null)
    const [file, setFile] = useState(null)
    const [profile, setProfile] = useState(null)
    const navigate = useNavigate()
    const currentUser = auth.currentUser

    useEffect(() => {
        if (currentUser == null) navigate("/", { replace: true })
        getCurrentUser()
    }, [])

    useEffect(() => {
        profileUpdate()
    }, [profile])

    const profileUpdate = async () => {
        if (!profile) return
        const userRef = doc(db, 'Users', currentUser.uid)
        await updateDoc(userRef, { ...user, "profileUrl": profile })
            .then(res => toast.success("Profile updated successfully!"))
            .catch(err => toast.error("Failed to update profile."))
    }

    const getCurrentUser = async () => {
        const docRef = doc(db, "Users", currentUser.uid)
        const data = await getDoc(docRef)
        if (data.exists) {
            setUser(data.data())
        } else {
            console.log("data doesn't exist")
        }
    }

    const updateProfile = async () => {
        const userRef = doc(db, 'Users', currentUser.uid)
        await updateDoc(userRef, user)
            .then(res => toast.success("Updated successfully!"))
            .catch(err => toast.error("Failed to update."))
        if (pass) {
            updatePassword(currentUser, pass).then(() => {
                toast.success("Password Updated")
            })
            .catch((err) => toast.error("Failed to update password."))
        }
    }

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    const handlePasswordChange = (e) => {
        setPass(e.target.value)
    }

    const goBack = () => {
        navigate(-1)
    }

    const exitUser = () => {
        signOut(auth)
        navigate("/", { replace: true })
    }

    const handleProfileUpdate = (e) => {
        console.log(e.target.files[0].name)
        setFile(e.target.files[0])
    }

    const uploadProfile = async () => {
        if (!file) {
            toast.error("Please upload file");
            return;
        }
        const storageRef = ref(storage, `/profiles/${currentUser.uid}`)
        uploadBytes(storageRef, file).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                console.log(url)
                setProfile(url)
            })
        })
    }

    return (
        <>
            <div className='d-f a-i-c j-c-sb' style={{ borderBottom: '1px solid lightgray', marginBottom: 40 }}>
                <h1 style={{ margin: 10 }}>Profile</h1>
                <div className='d-f a-i-c'>
                    <HomeRounded onClick={goBack} fontSize="large" className='ctop mv-10' />
                    <Button onClick={exitUser} variant="outlined">Logout</Button>
                </div>
            </div>
            <div className='d-f f-d-c a-i-c j-c-c'>
                <div className='d-f'>
                    <div className='d-f f-d-c a-i-c'>
                        <img src={profile ? profile : (user.profileUrl != "" || !user.profileUrl) ? avtar : user.profileUrl} alt="Profile" style={{ width: 200, height: 200, borderRadius: 100, margin: 20, objectFit: 'cover' }} />
                        <span style={{ flex: 1 }}></span>
                        <input variant="text" style={{ outline: 'dashed', outlineWidth: 2, padding: 10, borderRadius: 6, marginBottom: 10 }} onChange={handleProfileUpdate} type="file" />
                        <Button variant="contained" disableElevation onClick={uploadProfile} className="f-1">Upload</Button>
                    </div>
                    <div className="profile">
                        <Input variant='filled' label="Name" name="name" value={user.name} onChange={handleChange} InputLabelProps={{ shrink: true }} />
                        <Input variant='filled' label="Email" name="email" value={user.email} disabled InputLabelProps={{ shrink: true }} />
                        <Input variant='filled' label="Mobile" name="mobile" value={user.mobile} onChange={handleChange} InputLabelProps={{ shrink: true }} />
                        <Input variant='filled' type="password" name="password" label="Password" value={user.password} onChange={handlePasswordChange} />
                        <Button variant="contained" disableElevation onClick={updateProfile}>Save</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile1
