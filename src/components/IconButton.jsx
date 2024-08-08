import React from 'react'

function IconButton({ Icon, style, ...props }) {
    return (
        <div style={{ cursor: 'pointer', ...style }} {...props}>
            {Icon}
        </div>
    )
}

export default IconButton
