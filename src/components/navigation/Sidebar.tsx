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
      </NavLink>
      {SIDEBAR_ROUTES.map(route => (
        <NavLink
          key={route.name}
          className="sidebar-route-container"
          activeClassName="active-sidebar-route"
          exact
          to={route.url}
        >
          {route.renderIcon()}
          {route.name}
        </NavLink>
      ))}
    </div>
  )
}

export default Sidebar
