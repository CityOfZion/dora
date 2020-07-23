import React, { ReactElement } from 'react'
import ChevronUpIcon from '@material-ui/icons/ExpandLess'
import ChevronDownIcon from '@material-ui/icons/ExpandMore'

import './ExpandingPanel.scss'

const ExpandingPanel: React.FC<{
  title: string | ReactElement
  open: boolean
  children: React.ReactNode
}> = ({ title, open, children }) => {
  const [isOpen, setIsOpen] = React.useState(open)

  return (
    <div className="expanding-panel-container">
      <div
        className="expanding-panel-header"
        onClick={(): void => {
          setIsOpen(!isOpen)
        }}
      >
        <div className="expanding-panel-title">{title}</div>

        {isOpen ? (
          <ChevronDownIcon style={{ width: 30, color: '#D355E7' }} />
        ) : (
          <ChevronUpIcon style={{ width: 30, color: '#D355E7' }} />
        )}
      </div>
      <div className="expanding-panel-header-border" />
      {isOpen && children}
    </div>
  )
}

export default ExpandingPanel
