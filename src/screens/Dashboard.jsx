import React, { useState, useEffect } from 'react'
import { Course, CustomButton } from '../components'
import { Add } from '@mui/icons-material'
import { Button, TextField } from '@mui/material'
import Typography from '@mui/material/Typography';
import { Input } from '../components'
import modal from '../components/ModalCustome'
import '../style/style.css'
import { useNavigate } from 'react-router-dom'
import { getAuth } from 'firebase/auth'
import { db } from '../config/config'
import { setDoc, doc, getDoc, getDocs, collection, query, deleteDoc, addDoc } from 'firebase/firestore'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import avtar from '../resources/avtar.png'

function Dashboard() {
  const [open, setOpen] = useState(false)
  const [addModal, setAddModal] = useState(false)
  const [toDelete, setToDelete] = useState(null)

  const navigate = useNavigate()
  const auth = getAuth()
  const user = auth.currentUser

  const [profile, setProfile] = useState("")
  const [courses, setCourses] = useState([])
  const [coursesBack, setCoursesBack] = useState([])

  useEffect(() => {
    if (!user) return navigate("/", { replace: true })
    getSubjects()
    getProfile()
  }, [])

  useEffect(() => {
    console.log(profile)
  }, [profile, courses])

  const getProfile = async () => {
    const docRef = doc(db, "Users", user.uid)
    const response = await getDoc(docRef)
    if (response.exists()) {
      setProfile(response.data().profileUrl)
    } else console.log("No such document exist")
  }

  const getSubjects = async () => {
    const courseArr = []
    const q = query(collection(db, "Collage", user.uid, "Subject"))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach(doc => {
      courseArr.push({
        name: doc.id,
        units: 3,
        questions: 30,
        id: doc.id.toString().replace(" ", "_"),
      })
    })
    setCourses(courseArr)
  }

  const handleCloseAdd = () => {
    setAddModal(!addModal)
  }

  const handleAddClick = async (event) => {
    event.preventDefault()
    setAddModal(false)
    const newCourse = event.target.courseName.value
    const courseRef = doc(db, "Collage", user.uid, "Subject", newCourse)
    try {
      await setDoc(courseRef, {})
      toast.success("Course created successfully!")
    } catch (error) {
      toast.error("Error creating course")
      console.log(error)
    }

    const obj = [...courses, {
      name: newCourse,
      id: newCourse,
      units: 4,
      questions: 43
    }]
    setCourses(obj)
  }

  const handleClose = (modalObj) => {
    if (addModal) setAddModal(false)
    else setOpen(false)
  }

  const handleCallback = () => {
    setAddModal(true)
  }

  const handleOpen = (id) => {
    setOpen(true)
    setToDelete(id)
    console.log(id)
  }

  const deleteCourse = async () => {
    const docRef = doc(db, "Collage", user.uid, "Subject", toDelete.replace("_", " "))
    try {
      await deleteDoc(docRef)
      toast.success("Course deleted successfully!")
    } catch (error) {
      toast.error("Error deleting course")
      console.log(error)
    }

    handleClose()
    const data = courses.filter(item => item && item.id !== toDelete)
    setCourses(data)
  }

  const deleteCourseBody = (
    <>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Delete course
      </Typography>
      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
        Are you sure you will lose all data of this course?
      </Typography>
      <div style={{ marginTop: 20, float: 'right' }}>
        <Button variant='contained' disableElevation style={{ marginRight: 10 }} onClick={deleteCourse}>Delete</Button>
        <Button variant="outlined" onClick={handleClose}>Cancel</Button>
      </div>
    </>
  )

  const addCourseBody = (
    <form onSubmit={handleAddClick} className="d-f f-d-c">
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Add course
      </Typography>
      <Input label="Course Name" style={{ marginTop: 20 }} required={true} name="courseName" />
      <div style={{ marginTop: 20, alignSelf: 'flex-end' }}>
        <Button variant='contained' disableElevation style={{ marginRight: 10 }} type="submit">Add</Button>
        <Button variant="outlined" onClick={handleClose}>Cancel</Button>
      </div>
    </form>
  )

  return (
    <div>
      {modal(deleteCourseBody, handleClose, open)}
      {modal(addCourseBody, handleCloseAdd, addModal)}

      <div className="d-f j-c-sb">
        <h1 style={{ fontSize: 54 }}>Courses</h1>
        <div className="d-f a-i-c ctop"
          onClick={() => {
            navigate('Profile')
          }}>
          <div style={{ textAlign: 'right', marginRight: 20 }} className="profile-container">
            <h4>{user.displayName}</h4>
            <p style={{ color: 'gray' }}>{user.email}</p>
          </div>
          <img src={(profile !== "" && profile) ? profile : avtar} alt="avatar" style={{ borderRadius: 100, height: 60, width: 60, objectFit: 'cover' }} />
        </div>
      </div>
      <header>
        <div className='d-f a-i-c j-c-sb '>
          <CustomButton title={"Add Course"} callback={handleCallback} variant={"contained"} startIcon={<Add />} />
        </div>
      </header>
      <section className='courses'>
        <div className='courses-header'>
          <h3 style={{ fontWeight: 'normal' }}>All courses</h3>
        </div>
        <div className='d-f f-w-w'>
          {
            courses.map((item, index) => {
              if (item !== undefined) {
                return (<Course key={index} course={item} courseDeleteCallBack={() => { handleOpen(item.id) }} />)
              }
            })
          }
        </div>
      </section>

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  )
}

export default Dashboard
