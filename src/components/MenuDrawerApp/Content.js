import React, { useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'

export const Content = (props) => {
    const { className, setFocalIndex = () => {} } = props
    const memoizedSetFocalIndex = useCallback(setFocalIndex)
    const { route = '/' } = useParams()
    const text = route === ("/") ? 'select menu item' : `route = /${route}`

    useEffect(()=> {
        if (route) {
            memoizedSetFocalIndex(`/${route}`)
        }
    }, [route, memoizedSetFocalIndex])

    return (<div className={className}>{text}</div>)
}

export default Content