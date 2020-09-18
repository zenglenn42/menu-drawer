import React, { useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'

export const Content = (props) => {
    const { className, getIndexFromRoute = () => {}, flattenedMenuData, setFocalIndex = () => {} } = props
    const memoizedGetIndexFromRoute = useCallback(getIndexFromRoute)
    const memoizedSetFocalIndex = useCallback(setFocalIndex)
    const { route = '/' } = useParams()
    const text = route === ("/") ? 'select menu item' : `route = /${route}`

    useEffect(()=> {
        if (route) {
            const index = memoizedGetIndexFromRoute(`/${route}`, flattenedMenuData)
            memoizedSetFocalIndex(index)
        }
    }, [route, flattenedMenuData, memoizedGetIndexFromRoute, memoizedSetFocalIndex])

    return (<div className={className}>{text}</div>)
}

export default Content