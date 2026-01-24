import React, { ReactElement, useEffect, useState } from 'react'
import { slide as Menu } from 'react-burger-menu'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { closeMenu, openMenu } from '../../actions/menuActions'
import BurgerMenu from '../../assets/icons/burger-menu.svg?react'
import CloseIcon from '../../assets/icons/close-icon.svg?react'
import ResourceLogo from '../../assets/icons/coz-resource-logo.svg?react'
import MobileLogo from '../../assets/icons/mobile-logo.svg?react'
import { ROUTES, ROUTES_ENTRY } from '../../constants'
import { State as MenuState } from '../../reducers/menuReducer'
import Search from '../search/Search'
import './Navigation.scss'
import { AppThunkDispatch } from '../../store'
import Link from '../link/Link'

const Navigation: React.FC = (): ReactElement => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppThunkDispatch>()
  const menuState = useSelector(({ menu }: { menu: MenuState }) => menu)
  const location = useLocation()
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

  const applyActiveClassName = (route: ROUTES_ENTRY, isActive: boolean) => {
    const pathname = location.pathname.toLowerCase()
    const routeName = route.name.slice(0, -1).toLowerCase()

    const active =
      (pathname.includes(routeName) && pathname !== '/') ||
      pathname === '/' ||
      isActive

    return `mobile-route-container${active ? ' active-mobile-route' : ''}`
  }

  return (
    <>
      <div id="navigation-container">
        <div id="desktop-navigation">
          <div id="inner-desktop-navigation-container">
            <div id="coz-blockchain-logo">
              <Link
                href="https://coz.io"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ResourceLogo aria-hidden style={{ marginRight: '10px' }} />
              </Link>
            </div>

            <div className="navigation-search-container">
              <Search key={location.pathname} />
            </div>
          </div>
        </div>

        <div id="mobile-navigation">
          <div id="mobile-logo-container">
            <MobileLogo
              onClick={(): void => {
                dispatch(closeMenu())
                navigate(ROUTES.HOME.url)
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
              to={ROUTES.HOME.url}
              className={({ isActive }) =>
                applyActiveClassName(ROUTES.HOME, isActive)
              }
            >
              {ROUTES.HOME.renderIcon()}
              {ROUTES.HOME.name}
            </NavLink>
            <NavLink
              onClick={(): void => {
                dispatch(closeMenu())
              }}
              key={ROUTES.CONTRACTS.name}
              to={ROUTES.CONTRACTS.url}
              className={({ isActive }) =>
                applyActiveClassName(ROUTES.CONTRACTS, isActive)
              }
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
              to={ROUTES.TRANSACTIONS.url}
              className={({ isActive }) =>
                applyActiveClassName(ROUTES.TRANSACTIONS, isActive)
              }
            >
              {ROUTES.TRANSACTIONS.renderIcon()}
              {ROUTES.TRANSACTIONS.name}
            </NavLink>
            <NavLink
              key={ROUTES.BLOCKS.name}
              to={ROUTES.BLOCKS.url}
              onClick={(): void => {
                dispatch(closeMenu())
              }}
              className={({ isActive }) =>
                applyActiveClassName(ROUTES.BLOCKS, isActive)
              }
            >
              {ROUTES.BLOCKS.renderIcon()}
              {ROUTES.BLOCKS.name}
            </NavLink>

            <NavLink
              key={ROUTES.MONITOR.name}
              to={ROUTES.MONITOR.url}
              onClick={(): void => {
                dispatch(closeMenu())
              }}
              className={({ isActive }) =>
                applyActiveClassName(ROUTES.MONITOR, isActive)
              }
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
