import React, { useEffect, useState } from 'react';
import { CustomButton, Question, Input } from '../components';
import { Add } from '@mui/icons-material';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import { collection, getDocs, query } from 'firebase/firestore';
import { db, auth } from '../config/config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Chapter({ name = "Chapter", ...props }) {
    const { chapterId, id } = useParams();
    const [questions, setQuestions] = useState([]);
    const navigate = useNavigate();
    const user = auth.currentUser;
    const [refreshList, setRefresh] = useState(false);

    useEffect(() => {
        getQuestions();
    }, [refreshList]);

    const refresh = () => {
        setRefresh(!refreshList);
    };

    const getQuestions = async () => {
        try {
            const fetchedQuestion = [];

            const q = query(collection(db, "Collage", user.uid, "Subject", id.replace("_", " "), "Chapter", chapterId, "Question"));
            const querySnap = await getDocs(q);
            querySnap.forEach(doc => {
                fetchedQuestion.push({
                    id: doc.id,
                    data: doc.data()
                });
            });
            setQuestions(fetchedQuestion);
        } catch (error) {
            toast.error("Error fetching questions!");
            console.error("Error fetching questions:", error);
        }
    };

    const handleClick = () => {
        navigate("Question");
    };

    return (
        <>
            <header className="d-f j-c-sb a-i-c">
                <div className="d-f f-d-c f-1">
                    <h1>{name} {chapterId}</h1>
                </div>
                <CustomButton title='Add Question' variant={"contained"} startIcon={<Add />} callback={handleClick} />
            </header>
            <section className='courses-header'>
                <h3 style={{ fontWeight: 'normal' }}>All Questions</h3>
            </section>
            <div className="f-1" style={{ overflow: 'auto', height: "65vh" }}>
                <section className='units-section'>
                    {
                        questions.map(item => <Question key={item.id} item={item} itemDeleteRefresh={refresh} />)
                    }
                </section>
            </div>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </>
    );
}

export default Chapter;
