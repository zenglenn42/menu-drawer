import React from 'react'

const actionTypes = { 
  toggle_expander: 'toggle_expander',
  set_focal_index: 'set_focal_index' 
}

function nonTrivialResults(state) {
  return state && state.expandedItems.length
}

function combineExpansionReducers(...reducers) {
  return (state, action) => {
    // Iterate over a set of reducers, typically
    // from most constrictive to least, but only allow one
    // of them to determine the returned state.

    for (const reducer of reducers) {
      const results = reducer(state, action)

      // Defer to the first one to return a non-empty array of
      // expandable items.

      if (nonTrivialResults(results)) return results
    }

    // Otherwise, default to most permissive reducer.
    return permissiveReducer(state, action)
  }
}

// Allow any number of expanded or collapsed items.

function permissiveReducer(state, action) {
  const { expandedItems = [], focalIndex } = state
  switch (action.type) {
    case actionTypes.toggle_expander: {
      let nextExpandedItems = []
      let nextFocalIndex = focalIndex
      const closeIt = expandedItems.includes(action.index)
      if (closeIt) {
        nextExpandedItems = expandedItems.filter((i) => i !== action.index)
        nextFocalIndex = focalIndex === action.index ? undefined : focalIndex
      } else {
        nextExpandedItems = [...expandedItems, action.index]
        nextFocalIndex = action.index // make this the new focal index
      }
      return { expandedItems: nextExpandedItems, focalIndex: nextFocalIndex } // return a single open item
    }
    case actionTypes.set_focal_index: {
      const hasRoute = action.allItems[action.index].route
      const nextFocalIndex = (hasRoute) ? action.index : focalIndex
      return { ...state, focalIndex: nextFocalIndex }
    }
    default: {
      throw new Error(
        'Unhandled type in Accordion permissiveReducer: ' + action.type
      )
    }
  }
}

function preventCloseReducer(state, action) {
  const { expandedItems = [] } = state
  if (action.type === actionTypes.toggle_expander) {
    const closeIt = expandedItems.includes(action.index)
    const preventClose = expandedItems.length === 1
    if (closeIt && preventClose) {
      return state
    }
  }
}

function singleExpansionReducer(state, action) {
  const { expandedItems = [] } = state
  if (action.type === actionTypes.toggle_expander) {
    let nextExpandedItems = []
    let nextFocalIndex = undefined
    const openIt = !expandedItems.includes(action.index)
    if (openIt) {
      // reduce expanded items just to this one
      nextExpandedItems = [action.index]
      nextFocalIndex = action.index
      return { expandedItems: nextExpandedItems, focalIndex: nextFocalIndex }
    }
  }
}

function useExpandable({
  initialState = {
    expandedItems: [],
    focalIndex: undefined
  },
  reducer = permissiveReducer,
  items = []
} = {}) {

  const memoizedReducer = React.useCallback(reducer, [])
  const [
    state = { expandedItems: [], focalIndex: undefined },
    dispatch
  ] = React.useReducer(memoizedReducer, initialState)

  const { expandedItems, focalIndex } = state
  const toggleExpander = (index) => {
    dispatch({
      type: actionTypes.toggle_expander,
      index: index,
      allItems: items
    })
  }

  // Allow focal index to be set programmatically (instead of simply through
  // toggle clicks).  This is especially useful if you want the current route, 
  // for example, to drive state.

  const setFocalIndex = (index) => {
    if (typeof index === 'number' && index >= 0 && index < items.length) {

      // Defensively dispatch only when state change expected.
      //
      // Otherwise you may hit this:
      //
      // 'Warning: Maximum update depth exceeded. This can happen when a 
      //  component calls setState inside useEffect, but useEffect either 
      //  doesn't have a dependency array, or one of the dependencies changes 
      //  on every render.'
      //

      if (index !== focalIndex) {
        // console.log('useExpandable: setFocalIndex', focalIndex, ' -> ', index)
        dispatch({
          type: actionTypes.set_focal_index,
          index: index,
          allItems: items
        })
      } 
    }
  }

  return { expandedItems, focalIndex, toggleExpander, setFocalIndex }
}

export {
  useExpandable,
  combineExpansionReducers,
  preventCloseReducer,
  singleExpansionReducer,
  permissiveReducer,
  actionTypes
}
