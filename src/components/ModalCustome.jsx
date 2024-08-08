import { Modal } from '@mui/material';
import React from 'react'
import { Box } from '@mui/system';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'white',
    p: 4,
    boxShadow: 24,
    outline: 'none'

};


const modal = (body, handleCloseCallback, openState) => (
    <Modal
        open={openState}
        disableEnforceFocus
        onClose={handleCloseCallback}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <Box sx={style}>
            {body}
        </Box>
    </Modal>
)


export default modal
