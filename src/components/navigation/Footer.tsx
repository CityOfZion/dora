import React, { ReactNode, ReactElement } from 'react'
import { Link } from 'react-router-dom'
import './Footer.scss'
import logo from '../../assets/icons/neoscan-logo.svg'
import cozLogo from '../../assets/icons/coz-logo.svg'
import newsStreamLogo from '../../assets/icons/news-stream-logo.svg'
import cozSm from '../../assets/icons/coz-logo-sm.svg'
import gitHubLogo from '../../assets/icons/github-logo.svg'
import discordLogo from '../../assets/icons/discord-logo.svg'
import neoScanApiLogo from '../../assets/icons/neoscan-sm.svg'

type FakeNewsFeedShape = {
  image: string
  description: string
}
const makeNewsStream = (data?: FakeNewsFeedShape[]): ReactNode | null => {
  if (!data) {
    return null
  }
  return data.map(item => (
    <div className={'news-item'}>
      <img alt={item.image} src={item.image} />
      <p>item.description</p>
    </div>
  ))
}

const Footer: React.FC = (): ReactElement => {
  return (
    <div id="Footer">
      <div id="footer-body">
        <div className="footer-col-1">
          <div className="neoscan-logo-container">
            <img className="neoscan-logo" alt="neoscan-logo" src={logo} />
            <span className="neoscan-copy">neoscan</span>
          </div>
          <div className="license-copy">
            <p>
              The source code is{' '}
              <a className="accent" href="#">
                licensed MIT
              </a>{' '}
              The website content is licensed{' '}
              <a className="accent own-line" href="#">
                CC ANS 4.0
              </a>{' '}
              <span className="accent">NEOSCAN Testnet</span>
            </p>
          </div>
        </div>
        <div className="section-container">
          <p>Links</p>
          <hr className="divider" />
          <ul className="links-list">
            <li>
              <Link to="/contracts">Contracts</Link>
            </li>
            <li>
              <Link to="/transactions">Transactions</Link>
            </li>
            <li>
              <Link to="/blocks">Blocks</Link>
            </li>
            <li>
              <Link to="/wallets">Wallets</Link>
            </li>
            <li>
              <Link to="/assets">Assets</Link>
            </li>
            <li>
              <Link to="/api">API</Link>
            </li>
          </ul>
        </div>
        <div className="section-container">
          <p>More information</p>
          <hr className="divider" />
          <p className="neoscan-description">
            NEOScan is part of COZ. To learn more about the NEOScan and where it
            fits within the COZ organisation and it’s products please follow the
            links below:
          </p>
          <div className="info-links-container">
            <a className="accent" href="#">
              <img
                className="icon"
                alt="NEOSCAN API logo"
                src={neoScanApiLogo}
              />
              <span>NEOSCAN API</span>
            </a>
            <a className="accent" href="#">
              <img className="icon" alt="Github logo" src={gitHubLogo} />
              <span>COZ Github</span>
            </a>
            <a className="accent" href="#">
              <img className="icon" alt="COZ logo" src={cozSm} />
              <span>COZ</span>
            </a>
            <a className="accent" href="#">
              <img className="icon" alt="NEO Discord logo" src={discordLogo} />
              <span>NEO Discord</span>
            </a>
          </div>
        </div>
        <div className="section-container">
          <div className="label-container">
            <img alt="news stream logo" src={newsStreamLogo} />
            <p>Latest from NEO NEWS TODAY</p>
          </div>
          <hr className="divider" />
          <div className="news-stream">
            {makeNewsStream()}
            <button
              onClick={(): void =>
                console.log(
                  'Soon I will fetch more news items for the news stream',
                )
              }
              className="view-more"
            >
              view more
            </button>
          </div>
        </div>
      </div>
      <div id="company-banner">
        <img className="coz-logo" alt="coz-logo" src={cozLogo} />
        <p className="copyright">
          2020 Copyright{' '}
          <a className="accent" href="#">
            COZ
          </a>
        </p>
      </div>
    </div>
  )
}

export default Footer
