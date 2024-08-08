import React, { useEffect, useState } from 'react'
import { Delete } from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import { auth, db } from '../config/config'
import { doc, collection, getCountFromServer } from 'firebase/firestore'

function Course({ course, courseDeleteCallBack, ...props }) {
    const navigate = useNavigate()
    const [unitCount, setUnitCount] = useState(0)
    const user = auth.currentUser


    useEffect(() => {
        getCount()
    }, [unitCount])

    const getCount = async () => {
        const ref = collection(db, "Collage", user.uid, "Subject", course.id.replace("_", " "), "Chapter")
        const snapShort = await getCountFromServer(ref)
        console.log(snapShort.data().count)
        setUnitCount(snapShort.data().count)
    }

    const handleCourseClick = () => {
        navigate('Unit/' + course.id)
    }



    return (
        <div style={courseStyle} className="course-item d-f a-i-c j-c-sb  mv-10" >
            <div style={{ padding: 10 }} className="d-f f-d-c f-1 " onClick={handleCourseClick}>
                <h1 style={{ margin: 0 }}>{course.name}</h1>

                <div className='d-f'>
                    <p className='mh-10' >• {unitCount} Units </p>

                </div>
            </div>
            <div onClick={courseDeleteCallBack}>
                <Delete />

            </div>
        </div>
    )
}

let courseStyle = {
    padding: '0px 20px', borderRadius: 10, border: '1px solid lightgray', marginTop: 20,
}

export default Course
