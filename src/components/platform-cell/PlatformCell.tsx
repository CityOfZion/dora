import React, { ReactElement } from 'react'

import Neo2 from '../../assets/icons/neo2.svg'
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
      if (protocol === 'neo2' && network === 'mainnet') {
        return (
          <div className="neo2-platform-cell">
            <img src={Neo2} alt="NEO 2" />
            <span>
              Neo <small>Legacy (Mainnet)</small>
            </span>
          </div>
        )
      } else if (protocol === 'neo2' && network === 'testnet') {
        return (
          <div className="neo2-platform-cell">
            <img src={Neo2} alt="NEO 2" />
            <span>
              Neo <small>Legacy (Testnet)</small>
            </span>
          </div>
        )
      } else if (protocol === 'neo3' && network === 'testnet') {
        return (
          <div className="neo3-platform-cell">
            <img src={Neo3} alt="NEO 3" />
            <span>
              Neo <small>(RC3 Testnet) </small>
            </span>
          </div>
        )
      } else if (protocol === 'neo3' && network === 'testnet_rc4') {
        return (
          <div className="neo3-platform-cell">
            <img src={Neo3} alt="NEO 3" />
            <span>
              Neo <small>(Testnet) </small>
            </span>
          </div>
        )
      } else if (protocol === 'neo3' && network === 'mainnet') {
        return (
          <div className="neo3-platform-cell">
            <img src={Neo3} alt="NEO 3" />
            <span>
              Neo <small>(Mainnet) </small>
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
