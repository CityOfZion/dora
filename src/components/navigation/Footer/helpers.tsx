import React, { ReactNode } from 'react'
import { ROUTES } from '../../../constants'
import { Link } from 'react-router-dom'
import cozSm from '../../../assets/icons/coz-logo-sm.svg'
import gitHubLogo from '../../../assets/icons/github-logo.svg'
import discordLogo from '../../../assets/icons/discord-logo.svg'
import neoScanApiLogo from '../../../assets/icons/neoscan-sm.svg'

interface FakeNewsFeedShape {
  image: string
  description: string
}

interface InfoLink {
  copy: string
  href: string
  src: string
  alt: string
}

interface InfoLinks {
  [key: string]: InfoLink
}

export const makeNavLinks = (): ReactNode => {
  const { HOME, ...routesWithOutHome } = ROUTES
  return Object.values(routesWithOutHome).map(route => (
    <li>
      <Link to={route.url}> {route.name} </Link>
    </li>
  ))
}

export const infoLinksData = {
  api: {
    copy: 'NEOSCAN API',
    href: '#',
    src: neoScanApiLogo,
    alt: 'Neoscan API logo',
  },
  github: {
    copy: 'COZ Github',
    href: '#',
    src: gitHubLogo,
    alt: 'Github logo',
  },
  coz: {
    copy: 'COZ',
    href: '#',
    src: cozSm,
    alt: 'Coz logo',
  },
  discord: {
    copy: 'NEO Discord',
    href: '#',
    src: discordLogo,
    alt: 'NEO Discord logo',
  },
}

export const makeInfoLinks = (infoLinks: InfoLinks): ReactNode => {
  return Object.values(infoLinks).map(link => (
    <a className="accent" href={link.href}>
      <img className="icon" alt={link.alt} src={link.src} />
      <span>{link.copy}</span>
    </a>
  ))
}

export const makeNewsStream = (
  data?: FakeNewsFeedShape[],
): ReactNode | null => {
  if (!data) {
    return null
  }
  return data.map(item => (
    <div className={'news-item'}>
      <img alt={item.image} src={item.image} />
      <p>item.description </p>
    </div>
  ))
}
