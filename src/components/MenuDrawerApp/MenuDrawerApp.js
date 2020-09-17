import React from 'react'
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import { useAccordion } from '../Accordion/useAccordion'
import {
    menuDataReducer,
    menuLayoutReducer,
    menuExpansionReducer,
    getIndexFromRoute
} from '../MenuDrawer/MenuDrawer'
import { Content } from '../Content'
import { articleTitle, drawer } from '../../style'

function MenuDrawerApp(props) {
    const { items, title, initialExpandedItems = [] } = props
    const flattenedMenuData = menuDataReducer(items)
    const { components, setFocalIndex } = useAccordion({
        items: flattenedMenuData,
        initialExpandedItems: initialExpandedItems,
        layoutReducer: menuLayoutReducer,
        expansionReducer: menuExpansionReducer
    })
    const MenuDrawer = () => (<div style={{padding: '0 1em', width: '100%'}}>{components}</div>)

    return (
        <Router>
            <header style={articleTitle}>{title}</header>
            <main style={{display: 'flex', flexDirection: 'row', overflow: 'hidden', width: '100%'}}>
                <div style={drawer}>
                    <MenuDrawer />
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
                                            flattenedMenuData={flattenedMenuData} 
                                            setFocalIndex={setFocalIndex} 
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