import React from 'react'
import { useAccordion } from './useAccordion'

function Accordion(props) {
  const { items, ...optional } = props
  const { components } = useAccordion({ items, ...optional })
  return <div style={{padding: '0 1em', width: '100%'}}>{components}</div>
}

export { Accordion }
