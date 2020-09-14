import React from 'react'
import { layoutActionTypes } from '../Accordion/useAccordion'
import { actionTypes as expandableActionTypes } from '../Accordion/useExpandable'
import { ReactComponent as ArrowdownIcon } from '../../api/svg/ArrowDown.svg'
import { ReactComponent as ArrowupIcon } from '../../api/svg/ArrowUp.svg'
import {
  isVisible,
  AccordionButton,
  AccordionItem,
  createContents,
  createEmptyItem
} from '../NestedAccordion/NestedAccordion'

// The following adds menu drawer behavior to a Nested Accordion component using
// inversion-of-control principle.

// ----------------------------------------------------------------------------
// Input Reduction
// ----------------------------------------------------------------------------

function menuItemsReducer(nestedItems, depth = 0, acc = [], parent) {
  const flattenedItems = nestedItems.reduce((acc, item, index) => {
    const hasNestedItems = item.items
    if (hasNestedItems) {
      acc.push({
        icon: item.icon,
        title: item.title,
        depth: depth,
        parent: parent
      })
      const newParent = acc.length - 1
      return menuItemsReducer(item.items, depth + 1, acc, newParent)
    } else {
      acc.push({
        ...item,
        depth: depth,
        parent: parent
      })
    }
    return acc
  }, acc)
  return flattenedItems
}

function getIndexFromRoute(route, flatItems) {
  const matchingIndex = flatItems.reduce((acc, item, index) => {
    acc = (route === item.route && item.route !== undefined) ? index : acc
    return acc
  }, -1)
  return matchingIndex
}

// ----------------------------------------------------------------------------
// Layout
// ----------------------------------------------------------------------------

function createMenuButton(
  index,
  focalIndex,
  isOpen = false,
  toggleFn,
  icon,
  title,
  route,
  focalRoute,
  expandedEmoji,
  collapsedEmoji
) {
  // Should we have an expander icon?
  const hasRoute = (route !== undefined)
  const expanderIcon = (hasRoute) 
      ? undefined
      : <span>{isOpen ? expandedEmoji : collapsedEmoji}</span>

  // Should we bold the text?
  let textStyle = { fontWeight: 'inherit', color: 'inherit' }
  if (hasRoute) {
    textStyle = (focalIndex === index) ? { fontWeight: 'bold', color: 'blue' } : textStyle
  } else {
    textStyle = (isOpen) ? {fontWeight: 'bold'} : textStyle
  }

  return (
    <AccordionButton isOpen={isOpen} onClick={() => toggleFn(index)}>
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
          <span style={textStyle} >
            {title}
          </span>
        </span>
        <div style={{ flex: '1' }} />
        {expanderIcon}
      </div>{' '}
    </AccordionButton>
  )
}

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
              {createMenuButton(
                index,
                action.focalIndex,
                action.expandedItems.includes(index),
                action.toggleItemFn,
                item.icon,
                item.title,
                item.route,
                focalRoute,
                <ArrowupIcon width="100%" height="2em" />,
                <ArrowdownIcon width="100%" height="2em" />
                // '👇',
                // '👈'
              )}
              {createContents(
                action.expandedItems.includes(index),
                item.contents
              )}
            </AccordionItem>
          )
        }
        return createEmptyItem(item.depth, index)
      })
    default: {
      throw new Error('Unhandled type in menuLayoutReducer: ' + action.type)
    }
  }
}

// ----------------------------------------------------------------------------
// Expansion behavior
// ----------------------------------------------------------------------------

// Allow only one peer item at a given nested depth to be visible.

function menuExpandedReducer(state, action) {
  const { expandedItems = [], focalIndex } = state

  function isaParent(item) {
    return (item.contents === undefined) && (item.route === undefined)
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

  if (action.type === expandableActionTypes.toggle_index) {
    let nextExpandedItems = []
    let nextFocalIndex = focalIndex
    const closeIt = expandedItems.includes(action.index)
    const hasRoute = (action.allItems[action.index].route !== undefined)
    if (closeIt) {
      if (hasRoute) {
          nextFocalIndex = focalIndex // can't close a menu route
          nextExpandedItems = [...expandedItems]
      } else {
        if (!isaParent(action.allItems[action.index])) {
          // leaf node, so update focalIndex
          nextFocalIndex = (focalIndex === action.index) ? undefined : focalIndex
        }
        if (expandedItems.length > 1) {
          nextExpandedItems = expandedItems.filter((i) => i !== action.index)
        }
      }
    } else {
      // openIt
      nextFocalIndex = isaParent(action.allItems[action.index])
        ? focalIndex
        : action.index 
      if (hasRoute) {
        nextExpandedItems = [...expandedItems]
      } else {
        nextExpandedItems = [
          ...removeExpandedPeersOf(action.index, expandedItems, action.allItems),
          action.index
        ]
      }
    }
    return { expandedItems: nextExpandedItems, focalIndex: nextFocalIndex }
  }
}

// ----------------------------------------------------------------------------
// focalIndex change
// ----------------------------------------------------------------------------

// I'm using history.push() instead of instrumenting layout components
// with <Link to={route}> since the former allows us to /drive/ focalIndex
// programmatically instead of just in response to clicks.

function focalIndexChangeCallback(index, items, history) {
  if (index) {
    const route = items[index].route
    const hasRoute = (route !== undefined)
    if (hasRoute) {
      if (history && history.push) {
        history.push(route)
      }
    }
  } 
}

export { menuItemsReducer, menuLayoutReducer, menuExpandedReducer, focalIndexChangeCallback, getIndexFromRoute }