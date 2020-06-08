import React from 'react'
import classNames from 'classnames'

import './Button.scss'

type ButtonProps = {
  children: React.ReactNode | React.ReactText
  primary?: boolean
  onClick: () => void
}

const Button: React.FC<ButtonProps> = ({
  children,
  primary = true,
  onClick,
}) => {
  const styles = classNames({
    'neoscan-button': true,
    'primary-button': primary,
    'secondary-button': !primary,
  })

  return (
    <button onClick={onClick} className={styles}>
      {children}
    </button>
  )
}

export default Button
