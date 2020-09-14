import React from 'react'
import { Switch, Route, Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { Content } from '../Content'
import { Accordion } from '../Accordion/Accordion'
import { articleTitle, drawer } from '../../style'
import {
    menuLayoutReducer,
    menuExpandedReducer,
    focalIndexChangeCallback,
    menuItemsReducer
} from '../MenuDrawer/MenuDrawer'

function MenuDrawerApp(props) {
    const { items, title, initialExpandedItems = [], initialFocalIndex } = props
    const flatMenuItems = menuItemsReducer(items)
    const history = createBrowserHistory()
    return (
        <Router history={history}>
            <header style={articleTitle}>{title}</header>
            <main style={{display: 'flex', flexDirection: 'row', overflow: 'hidden', width: '100%'}}>
                <div style={drawer}>
                    <Accordion
                        items={flatMenuItems}
                        initialExpandedItems={initialExpandedItems}
                        initialFocalIndex={initialFocalIndex}
                        layoutReducer={menuLayoutReducer}
                        expansionReducer={menuExpandedReducer}
                        focalIndexChangeCallback={focalIndexChangeCallback}
                    />
                </div>
                <div style={{flex: 2, width: '100%', color: 'black', backgroundColor: 'white'}}>
                    <Switch>
                        <Route
                            exact
                            from="/"
                            render={(props) => (
                                <Content {...props} text="select a menu item" />
                            )}  
                        />  
                        <Route
                            from="/"
                            render={(props) => {
                                return <Content {...props} text={`route = ${props.location.pathname}`} />
                            }}  
                        />  
                    </Switch>
                </div>
            </main>
        </Router>
    )
}

export default MenuDrawerApp