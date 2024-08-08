import React from 'react'
import { TextField } from '@mui/material'
function Input({ ...props }) {
    return (
        <>
            <TextField  style={{ marginBottom: 20 }}   {...props} />

        </>
    )
}

export default Input
