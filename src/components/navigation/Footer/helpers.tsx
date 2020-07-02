import React, { ReactNode } from 'react'
import { FOOTER_ROUTES } from '../../../constants'
import { Link } from 'react-router-dom'
import cozSm from '../../../assets/icons/coz-logo-sm.svg'
import gitHubLogo from '../../../assets/icons/github-logo.svg'
import discordLogo from '../../../assets/icons/discord-logo.svg'
import neoScanApiLogo from '../../../assets/icons/neoscan-sm.svg'

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
  return FOOTER_ROUTES.map(route => (
    <li key={route.name}>
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
    <a className="accent" key={link.copy} href={link.href}>
      <img className="icon" alt={link.alt} src={link.src} />
      <span>{link.copy}</span>
    </a>
  ))
}
