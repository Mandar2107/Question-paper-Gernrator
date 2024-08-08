import React, { useEffect, useState } from 'react'
import { Delete } from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import { collection, getCountFromServer,doc } from 'firebase/firestore'
import { db, auth } from '../config/config'

function UnitItem({ name, unitDeleteCallBack, chapterId, ...props }) {

    const [questions, setQuestions] = useState(0)
    const user = auth.currentUser
    const { id } = useParams()

    const navigate = useNavigate()
    useEffect(() => {
        getCount()
    }, [questions])

    const getCount = async () => {
        const ref = collection(db, "Collage", user.uid, "Subject", id.replace("_", " "), "Chapter", chapterId,"Question")
        const snapShort = await getCountFromServer(ref)
        setQuestions(snapShort.data().count)
    }

    const handleCourseClick = () => {
        navigate('Chapter/' + chapterId)
    }


    return (
        <div style={courseStyle} className="course-item">
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flex: 1 }} onClick={handleCourseClick}>
                <h1>{name}</h1>
                <p style={{ margin: '0px 10px' }}>• {questions} Questions </p>
            </div>
            <div onClick={unitDeleteCallBack}>
                <Delete />
            </div>
        </div>
    )
}

let courseStyle = {
    display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: '0px 40px', borderRadius: 10
    , border: '1px solid lightgray', marginTop: 20
}

export default UnitItem
