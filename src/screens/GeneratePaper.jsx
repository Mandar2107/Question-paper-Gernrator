import React, { useEffect, useState } from 'react'
import { CustomButton } from '../components'
import { PictureAsPdf } from '@mui/icons-material'
import { Input } from '../components'
import { TextField, MenuItem } from '@mui/material'
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { db, auth } from '../config/config'
import { doc, query, collection, getDocs, getDoc, addDoc } from 'firebase/firestore'
import { useParams } from 'react-router-dom'
import { getQuestion } from '../components/algorithm'
import { Link } from 'react-router-dom'
import { Modal, Box, Button, Typography } from '@mui/material'

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MAX_PAPER_SETS = 10;
const MAX_SUBQUESTIONS = 20;

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function GeneratePaper() {

    const [questions, setQuestions] = useState(0)
    const [paperSet, setPaperSets] = useState(1)
    const [papers, setPapers] = useState([])
    const [chapterName, setChapterName] = useState([])
    const [chapters, setChapters] = useState([])
    const [easy, setEasy] = useState([])
    const [medium, setMedium] = useState([])
    const [hard, setHard] = useState([])
    const [toPass, setToPass] = useState({})
    const [info, setInfo] = useState({})
    const [q, setQ] = useState({})
    const user = auth.currentUser
    const { id } = useParams()
    const [isValid, setValidity] = useState(0)
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    useEffect(() => {
        getChapters()

    }, [])


    useEffect(() => {
    }, [easy, medium, hard])





    const getChapters = async () => {
        let chaptersTemp = []

        const chapterRef = query(collection(db, "Collage", user.uid, "Subject", id.replace("_", " "), "Chapter"))
        const querySnapshot = await getDocs(chapterRef)

        querySnapshot.forEach(doc_ => {
            chaptersTemp.push(doc_.id)
        })

        setChapters(chaptersTemp)

        let q_s = {}
        let easyArr = []
        let mediumArr = []
        let hardArr = []

        // fetch all question from chapters 

        chaptersTemp.forEach(async element => {
            let chapter_ = query(collection(db, "Collage", user.uid, "Subject", id.replace("_", " "), "Chapter", element, "Question"))
            const ch = await getDocs(chapter_)
            let tempEasy = []
            let tempMedium = []
            let tempHard = []

            ch.forEach(q => {

                // if (q_s[element])
                //     q_s[element] = [...q_s[element], { ...q.data(), "id": q.id }]
                // else
                //     q_s[element] = [{ ...q.data(), "id": q.id }]

                if (q.data().difficulty == "Easy") {
                    tempEasy.push({ ...q.data(), "id": q.id })
                } else if (q.data().difficulty == "Medium") {
                    tempMedium.push({ ...q.data(), "id": q.id })
                } else {
                    tempHard.push({ ...q.data(), "id": q.id })
                }
            })
            easyArr.push(tempEasy)
            mediumArr.push(tempMedium)
            hardArr.push(tempHard)
        });

        console.log(easyArr, mediumArr, hardArr)
        setEasy(easyArr)
        setMedium(mediumArr)
        setHard(hardArr)
    }

    const generatePdfFromData = () => {
        let object = {}
        object = getQuestion(easy, medium, hard, q, paperSet)

        // for (let i in q) {

        //     let obj = q[i]
        //     let temp = null

        //     if (obj.difficulty == "Easy") {
        //         temp = getQuestion(easy, obj, q)
        //         console.log("Consoling Generated Easy ", temp)

        //     } else if (obj.difficulty == "Medium") {
        //         temp = getQuestion(medium, obj, q)
        //         console.log("Consoling Generated questions Medium", temp)
        //     } else {
        //         temp = getQuestion(hard, obj, q)
        //         console.log("Consoling Generated questions hard", temp)
        //     }

        //     object[i] = temp

        // }

        console.log(object)

        setPapers(object)

        localStorage.setItem("papers", JSON.stringify(object))
        localStorage.setItem("info", JSON.stringify(info))
        localStorage.setItem("id", id)
        localStorage.setItem("uid", user.uid)

        // object array of questions 
        // for length of object 
        handleOpen()
        setToPass({ ...info, "questions": object })
        setValidity(2)
    }


    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setChapterName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };


    const handleOnQ = (event) => {
        let q = event.target.value
        if (q <= MAX_SUBQUESTIONS) setQuestions(event.target.value)

        else alert("Please enter valid questions")
    }

    const handlePaperSets = (event) => {
        let sets = event.target.value

        if (sets == 0) alert("Please enter valid sets")

        else
            if (sets > MAX_PAPER_SETS) {
                alert("Please you can only make max 10 paper sets")
            } else {
                setPaperSets(sets)
            }


    }

    const handleFieldChange = (e) => {
        let temp = e.target.value
        if (e.target.name == "instruction") temp = temp != "" ? temp.split(",") : []
        setInfo({ ...info, [e.target.name]: temp })
    }

    const handleSubmitForm = (event) => {
        event.preventDefault()
        setValidity(value => value + 1)
    }

    const questionUpdated = (index, field) => {

        if (q[index]) {
            let temp = q[index]
            temp[field.target.name] = field.target.value
            setQ({ ...q, [index]: temp })
        } else {
            let temp = {}
            temp[field.target.name] = field.target.value
            setQ({ ...q, [index]: temp })
        }


    }

    const questionGenerator = (index) => (

        <div className='d-f mh-10' key={index}>
            <h3 style={{ marginRight: 10, alignSelf: 'center' }}>Q.{index + 1}</h3 >
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} className="question-single" >
                <TextField select label="Difficulty" name="difficulty" defaultValue={"Select Difficulty"} required={1} style={{ width: 100 }} onChange={(o) => questionUpdated(index, o)}>
                    <MenuItem value="Easy" label="Easy">Easy</MenuItem>
                    <MenuItem value="Medium" label="Medium">Medium</MenuItem>
                    <MenuItem value="Hard" label="Hard">Hard</MenuItem>
                </TextField>
                <span></span>
                <TextField select label="Type" name="type" defaultValue={"Select Type"} style={{ width: 100 }} onChange={(o) => questionUpdated(index, o)} >
                    <MenuItem value="Theory" label="Theory">Theory</MenuItem>
                    <MenuItem value="MCQ" label="MCQ">MCQ</MenuItem>
                </TextField>
                <span></span>
                <Input label="Number of Sub-questions" name="subQuestions" style={{ alignSelf: 'center' }} required={1} onChange={(o) => questionUpdated(index, o)} />
                <span></span>
                <Input label="Total Marks" name="marks" style={{ alignSelf: 'center' }} required={1} onChange={(o) => questionUpdated(index, o)} />
            </div>
        </div>
    )




    const generatedQuestions = []
    for (let i = 0; i < questions; i++) {
        generatedQuestions.push(questionGenerator(i))
    }



    return (
        <form onSubmit={handleSubmitForm} >

            {
                open ? <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Download Papers
                        </Typography>
                        {
                            papers.map((item, index) => {
                                console.log(item)
                                return <div className='d-f f-d-r j-c-sb' style={{marginBottom:10, borderBottom:"gray 1px dashed",paddingBottom:10}}>
                                    <p> Paper set {index + 1} </p>
                                    <Link to={"/test/id=" + index} target='_blank' rel="noopener noreferrer" state={{ from: { ...info, "questions": item }, id: id }} style={{  fontWeight: 400, backgroundColor: "#1976d2", padding: 16, borderRadius: 6, color: "white", textDecoration: 'none' }}>Download PDF</Link>
                                </div>
                            })
                        }

                    </Box>
                </Modal> : null
            }



            <div style={{ borderBottom: '1px solid lightgray' }} className="d-f a-i-c j-c-sb" >
                <h1>Generate Paper</h1>
                <div className='d-f a-i-c'>
                    {/* <Link to="/test" state={{ from: toPass, id: id }} style={{ marginRight: 40, fontWeight: 400, backgroundColor: "#1976d2", padding: 16, borderRadius: 6, color: "white", textDecoration: 'none' }}>Download PDF</Link> */}

                    {
                        // Hardcoded            
                        // isValid != -1 ? <Link to="/test" state={{ from: toPass, id: id }} style={{ marginRight: 40, fontWeight: 400, backgroundColor: "#1976d2", padding: 16, borderRadius: 6, color: "white", textDecoration: 'none' }}>Download PDF</Link>
                        // : null
                    }
                    <CustomButton title='Generate PDF' startIcon={<PictureAsPdf />} callback={generatePdfFromData} variant='contained' type="submit" />
                </div>
            </div>



            <div className='d-f responsive '>
                <div style={{ marginRight: 40 }} className='f-1 d-f f-d-c'>
                    <h3 >Information</h3>
                    <Input label="Exam Name" name="examName" variant="filled" required={1} onChange={handleFieldChange} />
                    <div className='d-f j-c-sb'>
                        <Input onChange={handleFieldChange} name="subject" label="Subject" variant="filled" className="f-1" style={{ marginRight: 20 }} required={1} />
                        <Input onChange={handleFieldChange} name="subjectCode" label="Subject Code" variant="filled" required={1} style={{ marginRight: 20 }} />
                        <Input onChange={handleFieldChange} name="paperCode" label="Paper Code" variant="filled" required={1} />
                    </div>
                    <div className='d-f j-c-sb'>
                        <Input onChange={handleFieldChange} name="dateTime" label="Date Time" variant="filled" className="f-1" style={{ marginRight: 20 }} required={1} />
                        <Input onChange={handleFieldChange} name="totalMarks" label="Total Marks" variant="filled" required={1} />
                    </div>
                    <Input label="Instructions" name="instruction" onChange={handleFieldChange} variant="filled" helperText="Separate instructions by comma " />

                </div>

                <div className='f-1'>
                    <div style={{ marginTop: 20 }} className="paper-divs f-d-r d-f ">
                        <div>
                            <InputLabel id="demo-multiple-checkbox-label">Select chapters</InputLabel>
                            <Select
                                style={{ width: 300 }}
                                labelId="demo-multiple-checkbox-label"
                                id="demo-multiple-checkbox"
                                multiple
                                value={chapterName}
                                onChange={handleChange}
                                input={<OutlinedInput label="Select chapters" />}
                                renderValue={(selected) => selected.join(', ')}
                                MenuProps={MenuProps}
                            >
                                {chapters.map((name) => (
                                    <MenuItem key={name} value={name}>
                                        <Checkbox checked={chapterName.indexOf(name) > -1} />
                                        <ListItemText primary={name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>
                        <div className='d-f f-d-r m-t-20'>
                            <Input label={"Number of Questions"} onChange={handleOnQ} type="number" required={1} />
                            <Input label={"Number of Sets"} onChange={handlePaperSets} type="number" required={1} />
                        </div>
                    </div>

                    <h3 style={{ borderBottom: '1px solid lightgray', paddingBottom: 10 }}>Questions</h3>
                    <div className='questions-container'>
                        {
                            generatedQuestions.map(item => item)
                        }

                    </div>
                </div>

            </div>


        </form >
    )
}

export default GeneratePaper
