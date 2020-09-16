import React from 'react'
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import { Content } from '../Content'
import { useAccordion } from '../Accordion/useAccordion'
import { articleTitle, drawer } from '../../style'
import {
    menuItemsReducer,
    menuLayoutReducer,
    menuExpandedReducer,
    getIndexFromRoute
} from '../MenuDrawer/MenuDrawer'

function MenuDrawerApp(props) {
    const { items, title, initialExpandedItems = [] } = props
    const flatMenuItems = menuItemsReducer(items)
    const { components, setFocalIndexFn } = useAccordion({
        items: flatMenuItems,
        initialExpandedItems: initialExpandedItems,
        layoutReducer: menuLayoutReducer,
        expansionReducer: menuExpandedReducer
    })
    const Accordion = () => (<div style={{padding: '0 1em', width: '100%'}}>{components}</div>)

    return (
        <Router>
            <header style={articleTitle}>{title}</header>
            <main style={{display: 'flex', flexDirection: 'row', overflow: 'hidden', width: '100%'}}>
                <div style={drawer}>
                    <Accordion />
                </div>
                <div style={{flex: 2, width: '100%', color: 'black', backgroundColor: 'white'}}>
                    <Switch>
                        <Route
                            exact
                            from="/"
                            render={(props) => {
                                return <Content {...props} text="select a menu item" />
                            }}  
                        />  
                        <Route
                            from="/"
                            render={ (props) => {
                                const route = props.location.pathname
                                return (<Content 
                                            {...props} 
                                            route={route} 
                                            getIndexFromRoute={getIndexFromRoute} 
                                            flatMenuItems={flatMenuItems} 
                                            setFocalIndexFn={setFocalIndexFn} 
                                            text={`route = ${route}`} 
                                        />)
                                }
                            }  
                        />  
                    </Switch>
                </div>
            </main>
        </Router>
    )
}

export default MenuDrawerApp