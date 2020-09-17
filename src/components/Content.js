import React, { useEffect, useCallback } from 'react'

export const Content = (props) => {
    const { className, route, getIndexFromRoute, flattenedMenuData, text, setFocalIndex } = props
    const memoizedGetIndexFromRoute = useCallback(getIndexFromRoute)
    const memoizedSetFocalIndex = useCallback(setFocalIndex)
    useEffect(()=>{
        if (route) {
            const index = memoizedGetIndexFromRoute(route, flattenedMenuData)
            memoizedSetFocalIndex(index)
        }
    }, [route, flattenedMenuData, memoizedGetIndexFromRoute, memoizedSetFocalIndex])
    return (<div className={className} style={{overflow: 'auto scroll', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100%', backgroundColor:'white', color: 'black'}} >
                {text}
            </div>)
}

export default Content