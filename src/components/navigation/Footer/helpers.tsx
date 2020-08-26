import React, { ReactNode } from 'react'
import { FOOTER_ROUTES } from '../../../constants'
import { Link } from 'react-router-dom'
import cozSm from '../../../assets/icons/coz-logo-sm.svg'
import gitHubLogo from '../../../assets/icons/github-logo.svg'
import discordLogo from '../../../assets/icons/discord-logo.svg'

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
  // api: {
  //   copy: 'Dora API',
  //   href: '#',
  //   src: neoScanApiLogo,
  //   alt: 'Neoscan API logo',
  // },
  github: {
    copy: 'COZ Github',
    href: 'https://github.com/CityOfZion',
    src: gitHubLogo,
    alt: 'Github logo',
  },
  coz: {
    copy: 'COZ',
    href: 'https://coz.io',
    src: cozSm,
    alt: 'Coz logo',
  },
  discord: {
    copy: 'Neo Discord',
    href: 'https://discordapp.com/invite/R8v48YA',
    src: discordLogo,
    alt: 'Neo Discord logo',
  },
}

export const makeInfoLinks = (infoLinks: InfoLinks): ReactNode => {
  return Object.values(infoLinks).map(link => (
    <a
      className="accent"
      key={link.copy}
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img className="icon" alt={link.alt} src={link.src} />
      <span>{link.copy}</span>
    </a>
  ))
}
