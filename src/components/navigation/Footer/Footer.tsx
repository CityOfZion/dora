import React, { ReactElement } from 'react'
import './Footer.scss'
import logo from '../../../assets/icons/neoscan-logo.svg'
import cozLogo from '../../../assets/icons/coz-logo.svg'
import newsStreamLogo from '../../../assets/icons/news-stream-logo.svg'
import {
  makeNavLinks,
  makeNewsStream,
  makeInfoLinks,
  infoLinksData,
} from './helpers'

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
          <ul className="links-list">{makeNavLinks()}</ul>
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
            {makeInfoLinks(infoLinksData)}
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
