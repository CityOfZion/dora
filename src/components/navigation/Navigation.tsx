import React, { ReactElement, useState, useEffect } from 'react'
import { slide as Menu } from 'react-burger-menu'

import './Navigation.scss'
import { ReactComponent as ResourceLogo } from '../../assets/icons/coz-resource-logo.svg'
import { ReactComponent as MobileLogo } from '../../assets/icons/mobile-logo.svg'
import { ReactComponent as BurgerMenu } from '../../assets/icons/burger-menu.svg'
import { ReactComponent as CloseIcon } from '../../assets/icons/close-icon.svg'
import Search from '../search/Search'
import { useLocation, NavLink, useHistory } from 'react-router-dom'
import { ROUTES } from '../../constants'
import { useSelector, useDispatch } from 'react-redux'
import { State as MenuState } from '../../reducers/menuReducer'
import { openMenu, closeMenu } from '../../actions/menuActions'
import NetworkToggle from '../network-toggle/NetworkToggle'

const Navigation: React.FC = (): ReactElement => {
  const location = useLocation()
  const history = useHistory()
  const dispatch = useDispatch()
  const menuState = useSelector(({ menu }: { menu: MenuState }) => menu)

  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = (): void => {
      setWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    return (): void => {
      window.removeEventListener('resize', handleResize)
    }
  })

  if (width > 768 && menuState.open) {
    dispatch(closeMenu())
  }

  function shouldDisableNetworkToggle(): boolean {
    return (
      location.pathname !== ROUTES.HOME.url &&
      location.pathname !== ROUTES.TRANSACTIONS.url &&
      location.pathname !== ROUTES.CONTRACTS.url &&
      location.pathname !== ROUTES.BLOCKS.url &&
      location.pathname !== ROUTES.MONITOR.url &&
      !location.pathname.includes(ROUTES.SEARCH.url)
    )
  }

  return (
    <>
      <div id="navigation-container">
        <div id="desktop-navigation">
          <div id="inner-desktop-navigation-container">
            <div id="coz-blockchain-logo">
              <ResourceLogo />
            </div>

            <div className="navigation-search-container">
              <Search />
            </div>

            <div className="navigation-network-toggle">
              <NetworkToggle disabled={shouldDisableNetworkToggle()} />
            </div>
          </div>
        </div>

        <div id="mobile-navigation">
          <div id="mobile-logo-container">
            <MobileLogo
              onClick={(): void => {
                dispatch(closeMenu())
                history.push(ROUTES.HOME.url)
              }}
            />
          </div>
          <div id="burger-menu-container">
            {menuState.open ? (
              <CloseIcon
                onClick={(): void => {
                  dispatch(closeMenu())
                }}
              />
            ) : (
              <BurgerMenu
                onClick={(): void => {
                  dispatch(openMenu())
                }}
              />
            )}
          </div>
        </div>
      </div>

      <Menu
        disableOverlayClick
        width={'100%'}
        noTransition
        id="mobile-navigation-menu"
        isOpen={menuState.open}
        onStateChange={(state: { isOpen: boolean }): void => {
          if (state.isOpen) {
            dispatch(openMenu())
          } else {
            dispatch(closeMenu())
          }
        }}
        overlayClassName="bm-overlay-background"
      >
        <div
          id="mobile-routes-container"
          style={{ opacity: menuState.open ? 1 : 0 }}
        >
          <div className="mobile-routes-row">
            <NavLink
              onClick={(): void => {
                dispatch(closeMenu())
              }}
              key={ROUTES.HOME.name}
              className="mobile-route-container"
              activeClassName="active-mobile-route"
              isActive={(match, location): boolean => {
                if (
                  location.pathname.includes(
                    ROUTES.HOME.name.slice(0, -1).toLowerCase(),
                  ) &&
                  location.pathname !== '/'
                ) {
                  return true
                }
                if (location.pathname === '/' && match) {
                  return true
                }
                return false
              }}
              to={ROUTES.HOME.url}
            >
              {ROUTES.HOME.renderIcon()}
              {ROUTES.HOME.name}
            </NavLink>
            <NavLink
              onClick={(): void => {
                dispatch(closeMenu())
              }}
              key={ROUTES.CONTRACTS.name}
              className="mobile-route-container"
              activeClassName="active-mobile-route"
              isActive={(match, location): boolean => {
                if (
                  location.pathname.includes(
                    ROUTES.CONTRACTS.name.slice(0, -1).toLowerCase(),
                  ) &&
                  location.pathname !== '/'
                ) {
                  return true
                }
                if (location.pathname === '/' && match) {
                  return true
                }
                return false
              }}
              to={ROUTES.CONTRACTS.url}
            >
              {ROUTES.CONTRACTS.renderIcon()}
              {ROUTES.CONTRACTS.name}
            </NavLink>
          </div>
          <div className="mobile-routes-row">
            <NavLink
              onClick={(): void => {
                dispatch(closeMenu())
              }}
              key={ROUTES.TRANSACTIONS.name}
              className="mobile-route-container"
              activeClassName="active-mobile-route"
              isActive={(match, location): boolean => {
                if (
                  location.pathname.includes(
                    ROUTES.TRANSACTIONS.name.slice(0, -1).toLowerCase(),
                  ) &&
                  location.pathname !== '/'
                ) {
                  return true
                }
                if (location.pathname === '/' && match) {
                  return true
                }
                return false
              }}
              to={ROUTES.TRANSACTIONS.url}
            >
              {ROUTES.TRANSACTIONS.renderIcon()}
              {ROUTES.TRANSACTIONS.name}
            </NavLink>
            <NavLink
              onClick={(): void => {
                dispatch(closeMenu())
              }}
              key={ROUTES.BLOCKS.name}
              className="mobile-route-container"
              activeClassName="active-mobile-route"
              isActive={(match, location): boolean => {
                if (
                  location.pathname.includes(
                    ROUTES.BLOCKS.name.slice(0, -1).toLowerCase(),
                  ) &&
                  location.pathname !== '/'
                ) {
                  return true
                }
                if (location.pathname === '/' && match) {
                  return true
                }
                return false
              }}
              to={ROUTES.BLOCKS.url}
            >
              {ROUTES.BLOCKS.renderIcon()}
              {ROUTES.BLOCKS.name}
            </NavLink>
            <NavLink
              onClick={(): void => {
                dispatch(closeMenu())
              }}
              key={ROUTES.MONITOR.name}
              className="mobile-route-container"
              activeClassName="active-mobile-route"
              isActive={(match, location): boolean => {
                if (
                  location.pathname.includes(
                    ROUTES.MONITOR.name.slice(0, -1).toLowerCase(),
                  ) &&
                  location.pathname !== '/'
                ) {
                  return true
                }
                if (location.pathname === '/' && match) {
                  return true
                }
                return false
              }}
              to={ROUTES.MONITOR.url}
            >
              {ROUTES.MONITOR.renderIcon()}
              {ROUTES.MONITOR.name}
            </NavLink>
          </div>
        </div>
      </Menu>

      <div className="mobile-navigation-search-container">
        <Search />
      </div>
    </>
  )
}

export default Navigation
