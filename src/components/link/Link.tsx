import React from 'react'

export type LinkProps = {
  children: React.ReactNode
} & React.AnchorHTMLAttributes<HTMLAnchorElement>

const Link: React.FC<LinkProps> = ({ children, ...props }) => {
  return (
    <a {...props} style={{ textDecoration: 'none', color: 'inherit' }}>
      {children}
    </a>
  )
}

export default Link
