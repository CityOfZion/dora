/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { ReactElement } from 'react'

import './Footer.scss'
import logo from '../../../assets/icons/neoscan-logo.svg'
import cozLogo from '../../../assets/icons/coz-logo.svg'
import newsStreamLogo from '../../../assets/icons/news-stream-logo.svg'
import { makeNavLinks, makeInfoLinks, infoLinksData } from './helpers'
import Button from '../../button/Button'
import NewsFeed from './NewsFeed'

const Footer: React.FC = (): ReactElement => {
  return (
    <div id="footer-container">
      <div className="sidebar-spacer" />
      <div id="Footer">
        <div id="footer-body">
          <div className="footer-col-1">
            <div className="neoscan-logo-container">
              <img className="neoscan-logo" alt="neoscan-logo" src={logo} />
              <span className="neoscan-copy">dora</span>
            </div>
            <div className="license-copy">
              <p>
                The source code is <span className="accent">licensed MIT</span>{' '}
                the website content is licensed{' '}
                <span className="accent">CC ANS 4.0</span>{' '}
              </p>
            </div>
          </div>
          <div className="footer-sections">
            <div className="section-container first-section">
              <p>Links</p>
              <hr className="divider" />
              <ul className="links-list">{makeNavLinks()}</ul>
            </div>
            <div className="section-container second-section">
              <p>More information</p>
              <hr className="divider" />
              <p className="neoscan-description">
                Dora is part of COZ. To learn more about the Dora and where it
                fits within the COZ organisation and it’s products please follow
                the links below:
              </p>
              <div className="info-links-container ">
                {makeInfoLinks(infoLinksData)}
              </div>
            </div>
            <div className="section-container third-section">
              <div className="label-container">
                <img alt="news stream logo" src={newsStreamLogo} />
                <p>Latest from NEO NEWS TODAY</p>
              </div>
              <hr className="divider" />
              <div className="news-stream">
                <NewsFeed />
                <a
                  href="https://neonewstoday.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button primary={false}>view more</Button>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div id="company-banner">
          <div id="company-banner">
            <img className="coz-logo" alt="coz-logo" src={cozLogo} />
            <p className="copyright">
              {new Date().getFullYear()} Copyright{' '}
              <a
                className="accent"
                href="https://coz.io"
                target="_blank"
                rel="noopener noreferrer"
                data-test="test400"
              >
                COZ
              </a>
            </p>
          </div>
          <p className="last-commit">
            {process.env.REACT_APP_LAST_COMMIT ?? ''}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Footer
