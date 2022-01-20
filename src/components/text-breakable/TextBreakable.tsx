import React from 'react'

import './TextBreakable.scss'

interface Props {
  text: string
  className?: string
}

const TextBreakable: React.FC<Props> = ({ text, className }) => {
  return (
    <p
      className={
        !!className
          ? `text-breakable-container ${className}`
          : 'text-breakable-container'
      }
    >
      <span className="text-breakable">{text.slice(0, -3)}</span>
      <span className="text-no-breakable">{text.slice(-3)}</span>
    </p>
  )
}

export default TextBreakable
