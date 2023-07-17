import React, { ReactElement } from 'react'

import Neo3 from '../../assets/icons/neo3.svg'
import './PlatformCell.scss'

const PlatformCell = ({
  protocol,
  network,
}: {
  protocol: string | void
  network: string | void
}): ReactElement => (
  <div className="txid-index-cell PlatformCell">
    {((): ReactElement => {
      if (protocol === 'neo3' && network === 'testnet') {
        return (
          <div className="neo3-platform-cell">
            <img src={Neo3} alt="NEO 3" />
            <span>
              <small>Testnet</small>
            </span>
          </div>
        )
      } else if (protocol === 'neo3' && network === 'mainnet') {
        return (
          <div className="neo3-platform-cell">
            <img src={Neo3} alt="NEO 3" />
            <span>
              <small>Mainnet</small>
            </span>
          </div>
        )
      }
      return (
        <div className="neo3-platform-cell">
          <span>
            {protocol} <small>({network}) </small>
          </span>
        </div>
      )
    })()}
  </div>
)

export default PlatformCell
