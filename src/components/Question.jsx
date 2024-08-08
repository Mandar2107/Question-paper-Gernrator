import React, { useState } from 'react'
import IconButton from './IconButton'
import { Delete } from '@mui/icons-material'
import { EditOutlined } from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import modal from './ModalCustome'
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material'
import { Chip } from '@mui/material'
import { deleteDoc, doc } from 'firebase/firestore'
import { db, auth } from '../config/config'

function Question({ item, itemDeleteRefresh, ...props }) {

    const { id, chapterId } = useParams()

    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const user = auth.currentUser

    //Dialog for delete question 
    const handleClose = () => setOpen(false)

    const handleDeleteClick = async () => {
        // logic 
        const questionRef = doc(db, "Collage", user.uid, "Subject", id, "Chapter", chapterId, "Question", item.id)
        await deleteDoc(questionRef).then(res => alert("Deleted successfully!")).catch(err => console.log(err))
        handleClose()
        itemDeleteRefresh()
    }


    const bodyDeleteModal = (
        <>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Delete course
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Are you sure you will lose all data of this course?
            </Typography>
            <div style={{ marginTop: 20, float: 'right' }}>
                <Button variant='contained' disableElevation style={{ marginRight: 10 }} onClick={handleDeleteClick}>Delete</Button>
                <Button variant="outlined" onClick={handleClose}>Cancel</Button>
            </div>
        </>
    )

    // Navigate from questions to Question CRUD

    const redirect = () => {
        navigate('Question/' + item.id)
    }

    return (
        <div style={questionStyle} className="d-f f-d-r a-i-c j-c-sb">
            {modal(bodyDeleteModal, handleClose, open)}
            <div className='left-side-question' style={{ flex: 4 }}>
                <h3 style={{ marginBottom: 0 }}>Q. {item.data.question} </h3>
                <div className='d-f mh-10'>
                    <Chip label={item.data.difficulty} color={item.data.difficulty === "Medium" || item.data.difficulty === "Easy" ? "success" : "warning"} />
                    <Chip label={item.data.type} className="mv-10" />
                    <Chip label={"Marks " + item.data.marks} />
                </div>
            </div>
            <div className='right-side-buttons d-f j-c-sb ' style={{ flex: 0.4 }} >
                <IconButton Icon={<EditOutlined />} style={iconStyle} onClick={redirect} className="button-hover" />
                <IconButton Icon={<Delete />} style={iconStyle} onClick={() => setOpen(true)} className="button-hover" />
            </div>
        </div>
    )
}

let iconStyle = { border: '1px solid lightgray', padding: 10, borderRadius: 10, margin: 15 }
let questionStyle = {
    borderBottom: '1px solid #ededed'
}
export default Question
