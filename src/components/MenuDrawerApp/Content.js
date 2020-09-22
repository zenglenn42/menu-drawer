import React, { useEffect, useCallback } from 'react'
import { useParams, useLocation } from 'react-router-dom'

export const Content = (props) => {
    const { className, setFocalIndex = () => {}} = props
    const memoizedSetFocalIndex = useCallback(setFocalIndex)
    
    const { route = '/' } = useParams()
    const text = route === ("/") ? 'select menu item' : `route = /${route}`

    // How did we get here? From url or menu click?
    const location = useLocation()
    const { state: fromMenuClick = false } = location

    useEffect(()=> {
        if (!fromMenuClick) {
            memoizedSetFocalIndex(`/${route}`)
        }
    }, [route, memoizedSetFocalIndex, fromMenuClick])

    return (<div className={className}>{text}</div>)
}

export default Content