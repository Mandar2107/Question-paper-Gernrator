import React, { useState } from 'react'
import { Popover } from '@mui/material';
import Typography from '@mui/material/Typography';

function Popup({ id, text, popOpen, popClose, anchor, }) {

    // const [anchor, setAnchor] = useState(null)
    // const handlePopoverOpen = (event) => {
    //     setAnchor(event.currentTarget);
    // };

    // const handlePopoverClose = () => {
    //     setAnchor(null);
    // };

    const open = Boolean(anchor)
    return (
        <div>
            <Popover
                id={id}
                sx={{
                    pointerEvents: 'none',
                }}
                open={open}
                anchorEl={anchor}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={popClose}
                disableRestoreFocus
            >
                <Typography sx={{ p: 1 }}>{text}</Typography>
            </Popover>


        </div>
    )
}

export default Popup
