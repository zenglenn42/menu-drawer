import React from 'react'
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import { useMenuDrawer } from '../MenuDrawer/MenuDrawer'
import { Content } from './Content'
import './MenuDrawerApp.css'

function MenuDrawerApp(props) {
    const { items, title, initialExpandedItems = [] } = props
    const { MenuDrawer, setFocalIndexFromRoute } = useMenuDrawer({
        items: items,
        initialExpandedItems: initialExpandedItems,
    })

    return (
        <Router>
            <header className="articleTitle">{title}</header>
            <main className="mainMenuApp" >
                <MenuDrawer className="menuDrawer" />
                <div className="contentFrame" >
                    <Switch>
                        <Route exact from="/">
                            <Content className="content" />
                        </Route>
                        <Route from="/:route" >
                            <Content 
                                className="content" 
                                setFocalIndex={setFocalIndexFromRoute} 
                            />
                        </Route>
                    </Switch>
                </div>
            </main>
        </Router>
    )
}

export default MenuDrawerApp