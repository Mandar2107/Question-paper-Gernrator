import { Button } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { Input } from '../components'
import { db, auth } from '../config/config'
import { collection, doc, getDocs, query, deleteDoc } from 'firebase/firestore'
import { useParams } from 'react-router-dom'

import { Link } from 'react-router-dom'


function PreviousPDF() {

    const [papers, setPapers] = useState([])
    const [papersBack, setPapersBack] = useState([])
    const [refresh, setRefresh] = useState(false)
    const user = auth.currentUser
    const { id } = useParams()

    useEffect(() => {
        getPreviousPdfs()
    }, [refresh])

    useEffect(() => {

    }, [papers])

    const getPreviousPdfs = async () => {


        let getPapers = []

        const q = query(collection(db, "Collage", user.uid, "Subject", id.replace("_", " "), "Paper"))
        const querySnap = await getDocs(q)
        querySnap.forEach((doc) => {
            getPapers.push({
                data: doc.data(),
                id: doc.id,
                name: doc.data().examName
            })

        })
     
        setPapers(getPapers)
        setPapersBack(getPapers)
        
    }
    const handleDelete = async (_id) => {
        let text = "Do you delete?"
        if (window.confirm(text)) {
            //delete
            const questionRef = doc(db, "Collage", user.uid, "Subject", id, "Paper", _id)
            await deleteDoc(questionRef).then(res => alert("Deleted successfully!")).catch(err => console.log(err))
            alert("Deleted successfully!")
            setRefresh(!refresh)
        }
    }

    const handleOnSearch = (e) => {
        console.log(e.target.value)
        let value = e.target.value
        const filter = papersBack.filter(item => item.name.includes(value))
        console.log(filter)
        setPapers(filter)

    }


    const showPaper = papers.map(item => {

  

        return (<div className='d-f f-d-c change-width' style={{ border: '1px solid lightgray', borderRadius: 10, padding: '20px 20px', margin: 10 }}>
            <h3 style={{ textOverflow: 'ellipsis', maxWidth: '20vw', whiteSpace: 'nowrap', overflow: 'hidden', }}>{item.name}</h3>

            <div className="d-f f-d-c">

                <Link to="/test/id=0" state={{ from: item.data }} style={{ flex: 1, padding: 10, color: 'white', backgroundColor: '#1976d2', borderRadius: 4, textDecoration: 'none', textAlign: 'center' }}>Download</Link>
                <Button color="warning" onClick={() => { handleDelete(item.id) }} >Delete</Button>
            </div>
        </div>)
    }
    )
    return (
        <div>
            <div className='d-f j-c-sb f-1 a-i-c' style={{ borderBottom: '1px solid lightgray', paddingBottom: 20, marginBottom: 10 }}>
                <h1 style={{ flex: 2 }}>Previous Papers</h1>
                <Input label={"Search question paper"} style={{ paddingBottom: 0 }} className="f-1" onChange={handleOnSearch} />
            </div>

            <div className='d-f' style={{ flexWrap: 'wrap' }} >
                {showPaper}
            </div>

        </div>
    )
}

export default PreviousPDF
