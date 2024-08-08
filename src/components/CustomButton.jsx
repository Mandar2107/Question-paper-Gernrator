import React from 'react'
import { Button } from '@mui/material'

function CustomButton({ title = "", callback, ...props }) {
    return (
        <>
            <Button {...props}
                onClick={() => {
                    callback()
                }}
                style={buttonStyle}
                disableElevation
            >{title}</Button>
        </ >
    )
}

let buttonStyle = {
    padding: 14
}

export default CustomButton
