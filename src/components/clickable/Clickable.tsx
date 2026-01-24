import React from 'react'
import classNames from 'classnames'

import './Clickable.scss'

export type ClickableProps = {
  children: React.ReactNode
  disabled?: boolean
  variant?: 'contained' | 'icon' | 'unstyled'
  schema?: 'primary' | 'secondary'
  lowercase?: boolean
  style?: React.CSSProperties
} & React.HTMLAttributes<HTMLDivElement>

const Clickable: React.FC<ClickableProps> = ({
  children,
  disabled = false,
  variant = 'contained',
  schema = 'primary',
  lowercase = false,
  style,
}) => {
  const styles = classNames({
    contained: variant === 'contained',
    icon: variant === 'icon',
    unstyled: variant === 'unstyled',
    primary: schema === 'primary',
    secondary: schema === 'secondary',
    disabled: disabled,
    'lowercase-text': lowercase,
  })

  return (
    <div className={styles} style={style}>
      {children}
    </div>
  )
}

export default Clickable
