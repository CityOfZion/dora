import React, { ReactElement } from 'react'

import './Sidebar.scss'
import { SIDEBAR_ROUTES } from '../../constants'
import SidebarLogo from '../../assets/icons/sidebar-logo.svg'
import { NavLink } from 'react-router-dom'

const Sidebar: React.FC = (): ReactElement => {
  return (
    <div id="sidebar-container">
      <div id="sidebar-logo-container">
        <img src={SidebarLogo} alt="neoscan-sidebar-logo" />
      </div>
      {SIDEBAR_ROUTES.map(route => (
        <NavLink
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
