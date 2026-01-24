import React from 'react'

import Clickable, { ClickableProps } from '../clickable/Clickable'

export type ButtonProps = {
  onClick?: () => void
} & ClickableProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'contained',
  schema = 'primary',
  lowercase = false,
  ...props
}) => {
  return (
    <button onClick={onClick} disabled={disabled} {...props}>
      <Clickable
        variant={variant}
        schema={schema}
        disabled={disabled}
        lowercase={lowercase}
        style={props.style}
      >
        {children}
      </Clickable>
    </button>
  )
}

export default Button
