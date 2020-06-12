import React from 'react'

import expandMore from '../../assets/icons/expand-more.svg'
import expandLess from '../../assets/icons/expand-less.svg'
import './ExpandingPanel.scss'

const ExpandingPanel: React.FC<{
  title: string
  open: boolean
  children: React.ReactNode
}> = ({ title, open, children }) => {
  const [isOpen, setIsOpen] = React.useState(open)

  return (
    <div className="expanding-panel-container">
      <div
        className="expanding-panel-header"
        style={
          {
            // backgroundColor: isOpen
            //   ? 'var(--tertiary-color)'
            //   : 'var(--secondary-color)',
            // color: isOpen ? '#000033' : 'var(--text-color)',
            // borderBottom: isOpen ? '1px solid var(--tertiary-color)' : 'none',
          }
        }
        onClick={(): void => {
          setIsOpen(!isOpen)
        }}
      >
        <div className="expanding-panel-title">{title}</div>

        {isOpen ? (
          <div>
            <img src={expandMore} alt="Close" />
          </div>
        ) : (
          <div>
            <img src={expandLess} alt="Explore" />
          </div>
        )}
      </div>
      <div className="expanding-panel-header-border" />
      {isOpen && children}
    </div>
  )
}

export default ExpandingPanel
