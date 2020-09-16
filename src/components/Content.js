import React, { useEffect, useCallback } from 'react'

export const Content = (props) => {
    const { className, route, getIndexFromRoute, flatMenuItems, text, setFocalIndexFn } = props
    const getIndexFromRouteCB = useCallback(getIndexFromRoute)
    const setFocalIndexFnCB = useCallback(setFocalIndexFn)
    useEffect(()=>{
        if (route) {
            const index = getIndexFromRouteCB(route, flatMenuItems)
            setFocalIndexFnCB(index)
        }
    }, [route, flatMenuItems, getIndexFromRouteCB, setFocalIndexFnCB])
    return (<div className={className} style={{overflow: 'auto scroll', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100%', backgroundColor:'white', color: 'black'}} >
                {text}
            </div>)
}

export default Content