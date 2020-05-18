import React, { ReactElement } from 'react'
import './Footer.scss'
import logo from '../../assets/icons/neoscan-logo.svg'
import cozLogo from '../../assets/icons/coz-logo.svg'

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
        <div className="links-container">
          <p>Links</p>
          <hr />
          <ul className="links-list">
            <li>Contracts</li>
            <li>Transactions</li>
            <li>Blocks</li>
            <li>Wallets</li>
            <li>Assets</li>
            <li>API</li>
          </ul>
        </div>
        <div className="more-info-container">
          <p>More information</p>
          <hr />
          <p>
            NEOScan is part of COZ. To learn more about the NEOScan and where it
            fits within the COZ organisation and it’s products please follow the
            links below:
          </p>
          <div className="info-links-container">
            <a className="accent" href="#">
              I NEOSCAN API
            </a>
            <a className="accent" href="#">
              I COZ Github
            </a>
            <a className="accent" href="#">
              I COZ
            </a>
            <a className="accent" href="#">
              I NEO Discord
            </a>
          </div>
        </div>
        <div>
          <p>I Latest from NEO NEWS TODAY</p>
          <hr />
          <div className="news-stream">
            <button className="view-more">view more</button>
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
