import { MenuItem, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { CustomButton, Input } from '../components'
import InputAdornment from '@mui/material/InputAdornment';
import { Add } from '@mui/icons-material'
import Popover from '@mui/material/Popover'
import { useNavigate, useParams } from 'react-router-dom';
import { auth, db } from '../config/config';
import { addDoc, doc, collection, getDoc, setDoc } from 'firebase/firestore';


function QuestionPreview() {

    const [type, setType] = useState("text")
    const [mcq, setMcq] = useState(false)
    const [qinfo, setQinfo] = useState({})

    const navigate = useNavigate()

    const user = auth.currentUser

    const { qId, id, chapterId } = useParams()

    useEffect(() => {
        if (qId) getQuestionDetails()
    }, [])


    const getQuestionDetails = async () => {

        const question_ = doc(db, "Collage", user.uid, "Subject", id.replace("_"," "), "Chapter", chapterId, "Question", qId)
        const questionObj = await getDoc(question_)
        if (questionObj.exists()) {
            setQinfo(questionObj.data())
            questionObj.data().type === "MCQ" ? setMcq(true) : setMcq(false)

        } else {
            console.log("No such document exists!")
        }
        console.log(qinfo)
    }
    const handleTypeChange = (obj) => {
        setType(obj.target.value)
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        // fetch options 

        try {

            let a = event.target.a.value
            let b = event.target.b.value
            let c = event.target.c.value
            let d = event.target.d.value

            var obj = {
                question: event.target.question.value,
                marks: event.target.marks.value,
                difficulty: event.target.difficulty.value,
                type: event.target.type.value,
                figurUrl: '',
                a: a ? a : '',
                b: b ? b : '',
                c: c ? c : '',
                d: d ? d : ''

            }

        } catch (error) {

            var obj = {
                question: event.target.question.value,
                marks: event.target.marks.value,
                difficulty: event.target.difficulty.value,
                type: event.target.type.value,
                figurUrl: '',
                a: '',
                b: '',
                c: '',
                d: ''

            }
        }



        if (qId) {
            //update record
            const questionRef = doc(db, "Collage", user.uid, "Subject", id.replace("_"," "), "Chapter", chapterId, "Question", qId)
            const questionSnap = await setDoc(questionRef, obj).then(res => alert("Updated Successfully")).catch(err => console.log(err))
            navigate(-1)

        } else {
            const questionRef = collection(db, "Collage", user.uid, "Subject", id.replace("_"," "), "Chapter", chapterId, "Question")
            const questionSnap = await addDoc(questionRef, obj)
            //alert("Question saved successfully!")
            navigate(-1)
            // console.log(questionSnap.id)
        }

    }


    const handleOnFieldChange = (e) => {

        setQinfo({ ...qinfo, [e.target.name]: e.target.value })
    }


    return (
        <form style={{ display: 'flex', flexDirection: 'column', }} onSubmit={handleSubmit}>

            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <h1>Chapter {chapterId}</h1>
                <CustomButton startIcon={<Add />} title="Save Question" variant="contained" type="Submit" callback={() => { console.log("Submit") }} />
            </div>




            <Input variant="filled" label="Question" required={1} name="question" value={qinfo.question} InputLabelProps={{ shrink: true }} onChange={handleOnFieldChange} />
            {/* <Input InputProps={{ startAdornment: <InputAdornment position="start">Figure</InputAdornment>, }} type="file" accept="image/*" name="figure" /> */}

            <div style={{ display: 'flex', }} className="question-option-spacing">

                <Input onChange={handleOnFieldChange} label="Marks" required={1} name="marks" InputLabelProps={{ shrink: true }} value={qinfo.marks} />

                <TextField select label="Difficulty" value={qinfo.difficulty ? qinfo.difficulty : "Easy"} style={{ margin: '0px 20px' }} name="difficulty" required={1} onChange={handleOnFieldChange}  >
                    <MenuItem value="Easy" label="Easy">Easy</MenuItem>
                    <MenuItem value="Medium" label="Medium">Medium</MenuItem>
                    <MenuItem value="Hard" label="Hard">Hard</MenuItem>
                </TextField>

                <TextField select label="Type" defaultValue={qinfo.type ? qinfo.type : "Theory"} style={{ marginRight: 20 }} name="type" onChange={() => setMcq(!mcq)}  >
                    <MenuItem value="Theory" label="Theory">Theory</MenuItem>
                    <MenuItem value="MCQ" label="MCQ">MCQ</MenuItem>
                </TextField>
                {/* {
                    mcq ?
                        <TextField select label="Option Type" defaultValue={"Text"} name="optionType" onChange={handleTypeChange}  >
                            <MenuItem value="Text" label="Text">Text</MenuItem>
                            <MenuItem value="file" label="Figure">Figure</MenuItem>
                        </TextField> : null

                } */}
            </div>
            {
                mcq ? <div className='d-f f-d-c'>  <h3>Options</h3>
                    <Input InputProps={{ startAdornment: <InputAdornment position="start">A</InputAdornment>, }} value={qinfo.a} type={type} name="a" className="option" onChange={handleOnFieldChange} />
                    <Input InputProps={{ startAdornment: <InputAdornment position="start">B</InputAdornment>, }} value={qinfo.b} type={type} name="b" className="option" onChange={handleOnFieldChange} />
                    <Input InputProps={{ startAdornment: <InputAdornment position="start">C</InputAdornment>, }} value={qinfo.c} type={type} name="c" className="option" onChange={handleOnFieldChange} />
                    <Input InputProps={{ startAdornment: <InputAdornment position="start">D</InputAdornment>, }} value={qinfo.d} type={type} name="d" className="option" onChange={handleOnFieldChange} /></div> : null
            }


        </form>
    )
}


const optionStyle = {
    display: 'flex',
    flexDirection: 'row'
}

export default QuestionPreview
