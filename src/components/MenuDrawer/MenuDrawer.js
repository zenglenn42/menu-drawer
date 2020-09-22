import React from 'react'
import { layoutActionTypes } from '../Accordion/useAccordion'
import { actionTypes as expandableActionTypes } from '../Accordion/useExpandable'
import { ReactComponent as ArrowdownIcon } from '../../api/svg/ArrowDown.svg'
import { ReactComponent as ArrowupIcon } from '../../api/svg/ArrowUp.svg'
import { useAccordion } from '../Accordion/useAccordion'
import {
  isVisible,
  AccordionButton
  // AccordionItem
} from '../NestedAccordion/NestedAccordion'
import { Link } from 'react-router-dom'

// The following adds menu drawer behavior to a Nested Accordion component using
// inversion-of-control principle.

// ----------------------------------------------------------------------------
// Input Reduction
// ----------------------------------------------------------------------------

function menuDataReducer(nestedData, depth = 0, acc = [], parent) {
  const flattenedData = nestedData.reduce((acc, item, index) => {
    const hasNestedItems = item.items
    if (hasNestedItems) {
      acc.push({
        icon: item.icon,
        title: item.title,
        subtitle: item.subtitle,
        depth: depth,
        parent: parent
      })
      const newParent = acc.length - 1
      return menuDataReducer(item.items, depth + 1, acc, newParent)
    } else {
      acc.push({
        ...item,
        depth: depth,
        parent: parent
      })
    }
    return acc
  }, acc)
  return flattenedData
}

function getIndexFromRoute(route, flattenedMenuData) {
  const matchingIndex = flattenedMenuData.reduce((acc, item, index) => {
    acc = (route === item.route && item.route !== undefined) ? index : acc
    return acc
  }, -1)
  return matchingIndex
}

// ----------------------------------------------------------------------------
// Layout
// ----------------------------------------------------------------------------

function createMenuButton(
  clickHandler,
  focalIndex,
  focalRoute,
  focalParents,
  icon,
  index,
  isOpen = false,
  route,
  title,
  subtitle,
  expandIcon,
  collapseIcon
) {
  // Should we have an expander icon?
  const hasRoute = (route !== undefined)
  const expanderIcon = (hasRoute) 
      ? undefined
      : <span>{isOpen ? expandIcon : collapseIcon}</span>

  // Should we bold the text?
  let textStyle = { fontWeight: 'inherit', color: 'inherit' }
  if (hasRoute) {

    // Text style for focalIndex 
    // selected 'leaf node' that triggers new content to be displayed
    textStyle = (focalIndex === index) ? { fontWeight: 'bold', color: 'blue' } : textStyle

  } else if (focalParents.includes(index)) {

    // Text style for parents of the focalIndex
    // typically a muted version of focalIndex
    textStyle = { fontWeight: 'bold', color: '#5050f9' }

  } else {

    // Text style for non-focal parents
    // very nominal styling
    textStyle = {fontWeight: 'bold', color: '#606060'}

  }

  const _route = route || focalRoute || '/'
  return (
    <Link to={{pathname: _route, state: { fromMenuClick: true }}} >
      <AccordionButton isOpen={isOpen} onClick={() => clickHandler(index)}>
        <div
          style={{
            display: 'inline-flex',
            width: '100%',
            padding: '0.125em 0',
            borderRadius: '0.125em',
          }}
        >
          <span
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            {icon ? <span style={{ marginRight: '1em' }}>{icon}</span> : <></>}
            <span style={textStyle} >{title}</span>&nbsp;
            <span style={textStyle} >{subtitle}</span>
          </span>
          <div style={{ flex: '1' }} />
          {expanderIcon}
        </div>{' '}
      </AccordionButton>
    </Link>
  )
}

const AccordionItem = (props) => {
  const style = {
    display: 'grid',
    gridTemplate: 'auto auto',
    gridGap: 4,
    gridAutoFlow: (props.direction) === 'horizontal' ? 'column' : 'row',
    paddingLeft: `${props.indent * 2}em`
  }
  return (
    <div id={props.focalId} style={style}>{props.children}</div>
  )
}

function createMenuItem(index, item, action, focalParents = []) {
  const { depth, icon, route, title, subtitle = ''} = item
  const { allItems, expandedItems, focalIndex, setFocalIndex, toggleExpander } = action
  const focalRoute = (focalIndex === undefined) ? '/' : allItems[focalIndex].route
  const clickHandler = hasRoute(item) ? setFocalIndex : toggleExpander

  if (isVisible(item, expandedItems, allItems)) {
    const isOpen = expandedItems.includes(index)
    return (
      <AccordionItem
        key={`${depth}_${title}_${index}`}
        direction="vertical"
        indent={depth}
        focalId={index === focalIndex ? "focalId" : null}
      >
        {createMenuButton(
          clickHandler,
          focalIndex,
          focalRoute,
          focalParents,
          icon,
          index,
          isOpen,
          route,
          title,
          subtitle,
          <ArrowupIcon width="100%" height="2em" />,
          <ArrowdownIcon width="100%" height="2em" />
        )}
      </AccordionItem>
    )
  } 
}

function menuLayoutReducer(components, action) {
  const { allItems, focalIndex } = action
  const focalParents = parentsOf(focalIndex, allItems)
  switch (action.type) {
    case layoutActionTypes.map_items:
      const menu = allItems.map((item, index) => {
          return createMenuItem(index, item, action, focalParents)
      })
      return menu

    default: {
      throw new Error('Unhandled type in menuLayoutReducer: ' + action.type)
    }
  }
}

// ----------------------------------------------------------------------------
// Expansion behavior
// ----------------------------------------------------------------------------

// Allow only one peer item at a given nested depth to be visible.

function hasRoute(item) {
  return (item && item.route !== undefined)
}

function isaParent(item) {
  return !hasRoute(item)
}

function parentOf(itemIndex, allItems) {
  if (itemIndex <= 0) return undefined

  const itemDepth = allItems[itemIndex].depth
  let pIndex = itemIndex - 1
  while (pIndex >= 0) {
    const pDepth = allItems[pIndex].depth
    if (isaParent(allItems[pIndex]) && pDepth === itemDepth - 1) {
      return pIndex
    }
    pIndex = pIndex - 1
  }
  return undefined
}

function parentsOf(itemIndex, allItems) {
  const parents = []
  if (itemIndex === undefined) {
    return parents
  }

  let pIndex = parentOf(itemIndex, allItems)
  while (pIndex !== undefined && pIndex >= 0) {
    parents.push(pIndex)
    pIndex = parentOf(pIndex, allItems)
  }
  return parents
}

function removeExpandedPeersOf(itemIndex, expandedItems, allItems) {
  if (isaParent(allItems[itemIndex])) return expandedItems

  const depth = allItems[itemIndex].depth
  const parent = parentOf(itemIndex, allItems)

  return expandedItems.filter((i) => {
    const iDepth = allItems[i].depth
    // things at different levels are not peers by definition, so keep
    if (iDepth !== depth) return true

    // if item is a parent, then keep
    if (isaParent(allItems[i])) return true

    // if item has same parent, then it is a peer by definition, so remove
    const iParent = parentOf(i, allItems)
    if (iParent === parent) return false

    return true
  })
}

function menuExpansionReducer(state, action) {
  const { expandedItems = [], focalIndex } = state
  const { allItems, index } = action
  const item = allItems[index]

  switch(action.type) {
    case expandableActionTypes.toggle_expander: {
      let nextExpandedItems = []
      let nextFocalIndex = focalIndex
      const closeIt = expandedItems.includes(index)
      if (closeIt) {
        if (hasRoute(item)) {
            nextFocalIndex = focalIndex // can't close a menu route
            nextExpandedItems = [...expandedItems]
        } else {
          if (!isaParent(item)) {
            // leaf node, so update focalIndex
            nextFocalIndex = (focalIndex === index) ? undefined : focalIndex
          }
          if (expandedItems.length > 1) {
            nextExpandedItems = expandedItems.filter((i) => i !== index)
          }
        }
      } else {
        // openIt
        nextFocalIndex = isaParent(item) ? focalIndex : index 
        if (hasRoute(item)) {
          nextExpandedItems = [...expandedItems]
        } else {
          nextExpandedItems = [
            ...removeExpandedPeersOf(index, expandedItems, allItems),
            index
          ]
        }
      }
      return { expandedItems: nextExpandedItems, focalIndex: nextFocalIndex }
    }

    case expandableActionTypes.set_focal_index: {
        const nextFocalIndex = (hasRoute(item)) ? index : focalIndex
        return { ...state, focalIndex: nextFocalIndex }
    }

    default: {
      throw new Error(
        'Unhandled type in MenuDrawer menuExpansionReducer: ' + action.type
      )
    }
  }
}

function expandToDepth(depth, nestedInputData) {
  const flattenedInputData = menuDataReducer(nestedInputData)
  const maxDepth = depth
  return function() {
    const expandedItems = flattenedInputData.reduce( 
      (acc, item, index) => {
        if (hasRoute(item)) return acc

        if (item.depth <= maxDepth) {
          acc.push(index)
        }
        return acc 
      }, [])
    return expandedItems
  }
}

// ----------------------------------------------------------------------------
// Hook
// ----------------------------------------------------------------------------

function useMenuDrawer(props) {
  const { 
          items = [], 
          initialExpandedItems = [], 
          inputItemsReducer = menuDataReducer,
          layoutReducer = menuLayoutReducer, 
          expansionReducer = menuExpansionReducer } = props

  const flattenedMenuData = inputItemsReducer(items)

  const { components, setFocalIndex : setAccordionFocalIndex } = useAccordion({
    items: flattenedMenuData,
    initialExpandedItems: (typeof initialExpandedItems === 'function') 
                      ? initialExpandedItems() 
                      : initialExpandedItems,
    layoutReducer: layoutReducer,
    expansionReducer: expansionReducer,
  })
  
  const dfltClassName = 'menuDrawer'  // Style the div holding the menu
  const MenuDrawer = (props) => {
    return (
        <div className={props.className || dfltClassName }>
          {components}
        </div>
    )
  }

  const setFocalIndexFromRoute = (route) => {
    const index = getIndexFromRoute(route, flattenedMenuData)
    setAccordionFocalIndex(index)
  }

  return { MenuDrawer, setFocalIndexFromRoute }
}

export { 
  menuDataReducer, 
  menuLayoutReducer, 
  menuExpansionReducer, 
  expandToDepth,
  useMenuDrawer 
}