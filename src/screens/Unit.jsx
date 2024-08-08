import React, { useEffect, useState } from 'react';
import { CustomButton, IconButton, UnitItem } from '../components';
import { Add, Description, FolderOpen } from '@mui/icons-material';
import modal from '../components/ModalCustome';
import { Button, TextField, Popover } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Input, Popup } from '../components';
import { useNavigate, useParams } from 'react-router-dom';
import { db, auth } from '../config/config';
import { setDoc, doc, query, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Unit({ name = "Software Engineering", ...props }) {
    let { id } = useParams();

    const [anchor, setAnchor] = useState(null);
    const [anchor1, setAnchor1] = useState(null);
    const user = auth.currentUser;
    const [toDelete, setToDelete] = useState(null);
    const [addUnit, setAddUnit] = useState(false);
    const [open, setOpen] = useState(false);
    const [chapters, setChapters] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getChapters();
    }, [chapters]);

    const getChapters = async () => {
        try {
            let fetchedChapters = [];
            const q = query(collection(db, "Collage", user.uid, "Subject", id.replace("_", " "), "Chapter"));
            const querySnap = await getDocs(q);
            querySnap.forEach((doc) => {
                fetchedChapters.push({
                    name: doc.data().name,
                    id: doc.id
                });
            });
            setChapters(fetchedChapters);
        } catch (error) {
            toast.error("Error fetching chapters!");
            console.error("Error fetching chapters:", error);
        }
    };

    const handleCallback = () => {
        setAddUnit(true);
    };

    const handleAddUnitClose = () => setAddUnit(false);

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        let chNum = event.target.unitName.value;
        const docRef = doc(db, "Collage", user.uid, "Subject", id.replace("_", " "), "Chapter", chNum);
        try {
            await setDoc(docRef, { name: "Chapter " + chNum, id: chNum });
            toast.success("Chapter Saved");
        } catch (error) {
            toast.error("Error saving chapter");
            console.error(error);
        }
        handleAddUnitClose();
    };

    const handleClose = () => setAddUnit(false);

    const handlePopoverOpen = (event) => {
        if (event.target.id === "generate-pdf") setAnchor(event.currentTarget);
        else setAnchor1(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchor(null);
        setAnchor1(null);
    };

    const popOpen = Boolean(anchor);
    const popOpen_ = Boolean(anchor1);

    const addUnitBody = (
        <form onSubmit={handleFormSubmit} className="d-f f-d-c">
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Add Unit
            </Typography>
            <Input label="Unit Name" style={{ marginTop: 20 }} required name="unitName" />
            <div style={{ marginTop: 20, alignSelf: 'flex-end' }}>
                <Button variant="contained" disableElevation style={{ marginRight: 10 }} type="submit">Add</Button>
                <Button variant="outlined" onClick={handleClose}>Cancel</Button>
            </div>
        </form>
    );

    const handleDeleteClose = () => setOpen(false);

    const handleDelete = async () => {
        const docRef = doc(db, "Collage", user.uid, "Subject", id.replace("_", " "), "Chapter", toDelete);
        try {
            await deleteDoc(docRef);
            toast.success("Deleted successfully!");
        } catch (error) {
            toast.error("Error deleting");
            console.error(error);
        }
        handleDeleteClose();
    };

    const deleteCourseBody = (
        <>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Delete course
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Are you sure you will lose all data of this course?
            </Typography>
            <div style={{ marginTop: 20, float: 'right' }}>
                <Button variant="contained" disableElevation style={{ marginRight: 10 }} onClick={handleDelete}>Delete</Button>
                <Button variant="outlined" onClick={handleDeleteClose}>Cancel</Button>
            </div>
        </>
    );

    const redirect = () => {
        navigate('Generate');
    };

    return (
        <div>
            {modal(addUnitBody, handleAddUnitClose, addUnit)}
            {modal(deleteCourseBody, handleDeleteClose, open)}

            <header style={{ alignItems: 'flex-end' }} className="d-f j-c-sb ">
                <h1>{id.replace("_", " ")}</h1>
                <div className="d-f">
                    <CustomButton title='Add Unit' callback={handleCallback} variant="contained" startIcon={<Add />} />
                    <IconButton Icon={<Description />} onClick={redirect} style={buttonStyle} id="generate-pdf" onMouseEnter={handlePopoverOpen}
                        onMouseLeave={handlePopoverClose} />
                    <IconButton Icon={<FolderOpen />} onClick={() => { navigate("Previous") }} style={_buttonStyle} id="prev-pdf" onMouseEnter={handlePopoverOpen}
                        onMouseLeave={handlePopoverClose} />

                    <Popover
                        id="generate-pdf"
                        sx={{
                            pointerEvents: 'none',
                        }}
                        open={popOpen}
                        anchorEl={anchor}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        onClose={handlePopoverClose}
                        disableRestoreFocus
                    >
                        <Typography sx={{ p: 1 }}>Generate Paper</Typography>
                    </Popover>

                    <Popover
                        id="prev-pdf"
                        sx={{
                            pointerEvents: 'none',
                        }}
                        open={popOpen_}
                        anchorEl={anchor1}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        onClose={handlePopoverClose}
                        disableRestoreFocus
                    >
                        <Typography sx={{ p: 1 }}>Previous Paper</Typography>
                    </Popover>
                </div>
            </header>

            <section className="courses-header">
                <h3 style={{ fontWeight: 'normal' }}>All Units</h3>
            </section>
            <section className="units-section">
                {chapters.map(item => (
                    <UnitItem key={item.id} name={item.name} unitDeleteCallBack={() => { setOpen(true); setToDelete(item.id); }} chapterId={item.id} />
                ))}
            </section>

            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
}

const buttonStyle = { border: '2px solid #1976d2', color: "#1976d2", padding: 14, borderRadius: 10, marginLeft: 40 };
const _buttonStyle = { backgroundColor: '#1976d2', color: 'white', padding: 14, borderRadius: 10, marginLeft: 20 };

export default Unit;
