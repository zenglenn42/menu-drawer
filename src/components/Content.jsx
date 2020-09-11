import React from 'react'

export const Content = (props) => {
    const { className, text } = props
    return <div className={className} style={{overflow: 'auto scroll', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100%', backgroundColor:'white', color: 'black'}}>{text}</div>
}

export default Content
