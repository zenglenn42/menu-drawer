## Menu Drawer [(demo)](https://menu-drawer.herokuapp.com/)

### _Nested Accordion + Inversion-of-Control === Menu Drawer_

[![DEMO NESTED ACCORDION](docs/images/compare.png)](https://menu-drawer.herokuapp.com/)


## [Contents](#contents)

- [Overview](#overview)
- [Bootstrap repos](#bootstrap-repos)
- [Just add data](#just-add-data)
- [Debug](#debug)
- [Add some text styling](#add-text-styling)
- [Add application routes](#add-application-routes)
- [**Demo**](https://menu-drawer.herokuapp.com/) ☚
- [Summary](#summary)

## [Overview](#contents)

These days I'm working with React, Facebook's user interface library for web applications.

In this project, I leverage the `inversion-of-control` principle (discussed 
[here](https://github.com/zenglenn42/inversion-of-control/blob/master/README.md))
to transform a Nested Accordion component into a menu drawer, a staple of many user interfaces.

## [Bootstrap repos](#contents)

I bootstrap this repo directly from the `inversion-of-control` repo where the nested accordion lives.

* Update the branding text and icons in ./public
* Strip down the README and ./docs/images
* Update project data in packages.json
* Rework the src/App.js demo page jsx/html
* Verify I can render the nested accordion in the new environment
* Publish to github

Then I setup my deployment path

* Create a `menu-drawer` app on Heroku
* Add the `mars/create-react-app-buildpack` from my local github repo
    * heroku login
    * heroku buildpacks:set mars/create-react-app-buildpack
* Add a heroku remote
    * git add remote heroku https://git.heroku.com/menu-drawer.git
* Test the deployment build
    * git push heroku master
    
## [Just add data](#contents)

The Accordion is data-driven so I populate `inputdata.js` with the desired menu text.
(I'm using the Material-UI menu as a template.)

```javascript
# src/api/inpustdata.js

export const drawerItems = [
  {
    title: 'Components',
    items: [
      {
        title: 'Layout',
        items: [
          {
            title: 'Box',
            contents: (
              <div>box content</div>
            )
          },
          ..
        ]
      },
      ..
    ]
  }
]
```

This gets consumed in `src/App.js`

```javascript
import { drawerItems } from './api/inputdata'
import {
  nestedItemsClosure,
  nestedLayoutReducer,
  singlePeerExpandedReducer
} from './components/NestedAccordion/NestedAccordion'

function App() {
  return (
    <>
        <Accordion
            items={drawerItems}     // <-- :-)
            inputItemsReducer={nestedItemsClosure()}
            layoutReducer={nestedLayoutReducer}
            expansionReducer={singlePeerExpandedReducer}
        />
    </>
  )
}
```

## [Debug](#contents)

I find one CSS/JSS [styling issue](https://github.com/zenglenn42/menu-drawer/blob/6bda2a7b00f56b385b96fa12f8bb497ae054c2d3/src/components/Accordion/Accordion.js#L7) that horizontally trucates the menu within its parent accordion div.

I find a [minor logic](https://github.com/zenglenn42/menu-drawer/blob/6bda2a7b00f56b385b96fa12f8bb497ae054c2d3/src/components/NestedAccordion/NestedAccordion.js#L174) issue affecting expansion attributes of child elements with 0-index parents.

## [Add some text styling](#contents)

I'd like expanded items in the menu drawer to be in [bold text](https://github.com/zenglenn42/menu-drawer/blob/6bda2a7b00f56b385b96fa12f8bb497ae054c2d3/src/components/NestedAccordion/NestedAccordion.js#L155).

## [Add application routes](#contents)

### React Router

Menu drawer clicks typically drive application routes of some sort to request a new page from the server or to render content associated with a client-side route (typical with single page architecture).  In this case, it will be the former with clicks driving react-router:

```javascript
# src/App.js

import React from 'react'
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'

function App() {
  return (
    <Router>
      <header style={articleTitle}>Menu Drawer</header>
      <main>
        <div style={drawer}>
          <Accordion
            items={drawerItems}
            initialExpandedItems={[0, 1, 6]}
            inputItemsReducer={nestedItemsClosure()}
            layoutReducer={menuLayoutReducer}
            expansionReducer={menuExpandedReducer}
          />
        </div>
        <div>
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

```

### Input data

Since routes are missing from the accordion, we need to add them.

I start with the input data.  I replace the accordion `contents` field for a `route`
field:

```javascript
# src/api/inputdata.js

export const drawerItems = [ 
  {
    title: 'Components',
    items: [
      {   
        title: 'Layout',
        items: [
          {
            title: 'Box',
            route: '/box'  // <--
          },
          {
            title: 'Grid',
            route: '/grid' // <--
          },
          ..
        ]
      },
      ..
    ]
  }
]
```

### Menu Layout Reducer

Next, I update the layout of the menu items to include `<Link to='route'>` components to trigger react-router component rendering in response to selection clicks.

```javascript
function menuLayoutReducer(components, action) {
  switch (action.type) {
    case layoutActionTypes.map_items:
      const focalRoute = (action.focalIndex === undefined) ? '/' : action.allItems[action.focalIndex].route
      return action.allItems.map((item, index) => {
        if (isVisible(item, action.expandedItems, action.allItems)) {
          return (
            <AccordionItem
              key={`${item.depth}_${item.title}_${index}`}
              direction="vertical"
              indent={item.depth}
            >
              <Link to={(item.route) ? item.route : focalRoute}>
                <AccordionButton isOpen={isOpen} onClick={() => toggleFn(index)}>
                ..
                </AccordionButton>
              </Link>
              ..
            </AccordionItem>
          )
        }
      })
  }
}
```

### Expansion Reducer

The expand / collapse behavior for a menu drawer is slightly different from the nested accordion component we're extending.

We still want basic accordion behavior when a menu category or sub-category is clicked open or closed.  However, for so called _leaf node_ items (e.g., `Box`, `Grid`), we don't really need to toggle between an `open` or `closed` state.  We simply want react-router to render the associated component for the the `leaf node`'s route.

In otherwords, routable menu items don't need tracking in the `expandedItems` array maintained by `useExpandable`.

This implies a need to override the accordion's expansionReducer with route-sensitive logic.

You can see the code under src/components/MenuDrawer/MenuDrawer.js

### Menu Accordion?

We could probably craft a new `<MenuAccordion>` component to integrate the routing and custom reducers, but for now, I settle for expedient inlining and loading reducers through props:

```javascript
# src/App.js

  ..
  <Accordion
    items={drawerItems}
    initialExpandedItems={[0, 1, 6]}
    inputItemsReducer={nestedItemsClosure()}
    layoutReducer={menuLayoutReducer}
    expansionReducer={menuExpandedReducer}
  />
  ..
```
## [Summary](#contents)

By altering the input data schema and customizing two reducers, I morphed a nested accordion into a `React Router-ready` menu drawer using some inversion-of-control ideas introduced [here](https://github.com/zenglenn42/inversion-of-control/blob/master/README.md).  It took about 200 lines of code plus some router boilerplate.

I used _way_ too many inline styles, but that can be cleaned up in post. ;-)
I've got something I can start integrating into other projects of mine.
