import React from 'react'
import classNames from 'classnames'

import './Button.scss'

type ButtonProps = {
  children: React.ReactNode | React.ReactText
  primary?: boolean
  onClick?: () => void
  disabled?: boolean
}

const Button: React.FC<ButtonProps> = ({
  children,
  primary = true,
  onClick,
  disabled = false,
}) => {
  const styles = classNames({
    'neoscan-button': true,
    'primary-button': primary,
    'secondary-button': !primary,
    'disabled-button': disabled,
  })

  return (
    <button onClick={onClick} className={styles} disabled={disabled}>
      {children}
    </button>
  )
}

export default Button
