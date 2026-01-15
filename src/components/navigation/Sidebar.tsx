import React, { ReactElement } from 'react'

import './Sidebar.scss'
import { SIDEBAR_ROUTES, ROUTES } from '../../constants'
import SidebarLogo from '../../assets/icons/sidebar-logo.svg'
import { NavLink } from 'react-router-dom'

const Sidebar: React.FC = (): ReactElement => {
  return (
    <div id="sidebar-container">
      <NavLink id="sidebar-logo-container" to={ROUTES.HOME.url}>
        <img src={SidebarLogo} alt="neoscan-sidebar-logo" />
        <p>dora</p>
      </NavLink>
      {SIDEBAR_ROUTES.map(route => (
        <NavLink
          key={route.name}
          to={route.url}
          target={route.target}
          className={({ isActive }) => {
            const pathname = location.pathname

            const customActive =
              (pathname.includes(route.name.slice(0, -1).toLowerCase()) &&
                pathname !== '/') ||
              (pathname === '/' && isActive)

            return `sidebar-route-container ${
              customActive ? 'active-sidebar-route' : ''
            }`
          }}
        >
          {route.renderIcon()}
          {route.name}
        </NavLink>
      ))}
    </div>
  )
}

export default Sidebar
