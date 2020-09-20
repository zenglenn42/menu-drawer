import React from 'react'
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import { useAccordion } from '../Accordion/useAccordion'
import {
    menuDataReducer,
    menuLayoutReducer,
    menuExpansionReducer,
    getIndexFromRoute
} from '../MenuDrawer/MenuDrawer'
import { Content } from './Content'
import '../../App.css'
import './MenuDrawer.css'

function MenuDrawerApp(props) {
    const { items, title, initialExpandedItems = [] } = props
    const flattenedMenuData = menuDataReducer(items)
    const { components, setFocalIndex } = useAccordion({
        className: "menuDrawer",
        items: flattenedMenuData,
        initialExpandedItems: initialExpandedItems,
        layoutReducer: menuLayoutReducer,
        expansionReducer: menuExpansionReducer,
    })
    const MenuDrawer = () => (<>{components}</>)

    return (
        <Router>
            <header className="articleTitle">{title}</header>
            <main className="mainMenuApp" >
                <MenuDrawer />
                <div className="contentFrame" >
                    <Switch>
                        <Route exact from="/">
                            <Content className="content" />
                        </Route>
                        <Route from="/:route" >
                            <Content 
                                className="content" 
                                flattenedMenuData={flattenedMenuData} 
                                getIndexFromRoute={getIndexFromRoute} 
                                setFocalIndex={setFocalIndex} 
                            />
                        </Route>
                    </Switch>
                </div>
            </main>
        </Router>
    )
}

export default MenuDrawerApp