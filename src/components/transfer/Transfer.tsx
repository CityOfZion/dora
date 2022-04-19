import React from 'react'
import uniqueId from 'lodash/uniqueId'

import { ReactComponent as TransferArrow } from '../../assets/icons/transfer-arrow.svg'
import tokens from '../../assets/nep5/svg'
import txBackgroundCubes from '../../assets/tx_mask.svg'
import txCube from '../../assets/tx_cube.svg'
import Neo2 from '../../assets/icons/neo2.svg'
import Neo3 from '../../assets/icons/neo3.svg'
import GAS2 from '../../assets/icons/GAS_2.svg'
import GAS3 from '../../assets/icons/GAS_3.svg'

import './Transfer.scss'

type Transfer = {
  from: string
  name: string
  to: string
  amount: string | number
  symbol: string
}

function returnTransferLogo(
  name: string,
  chain: string,
): React.ReactNode | string {
  if (name === 'GAS') {
    return chain === 'neo2' ? (
      <img src={GAS2} alt="token-logo" />
    ) : (
      <img src={GAS3} alt="token-logo" />
    )
  }

  if (name === 'NEO') {
    return chain === 'neo2' ? (
      <img src={Neo2} alt="token-logo" />
    ) : (
      <img src={Neo3} alt="token-logo" />
    )
  }

  return tokens[name] && <img src={tokens[name]} alt="token-logo" />
}

const Transfer: React.FC<{
  transfers: Array<Transfer>
  handleAddressClick: (address: string) => void
  size: string
  networkFee: string
  systemFee: string
  chain: string
}> = ({
  transfers = [],
  handleAddressClick,
  networkFee,
  systemFee,
  size,
  chain,
}) => (
  <div className="transfer-container">
    <div className="transfer-column detail-tile">
      <label>SENT FROM</label>
      <div className="asset-transfer-details-container">
        {transfers.map(
          (transfer: Transfer) =>
            transfer.from && (
              <div key={uniqueId()} className="asset-transfer-detail-container">
                <div
                  className="link"
                  onClick={(): void => handleAddressClick(transfer.from)}
                  style={{ color: '#d355e7' }}
                >
                  {transfer.from}
                </div>
                <div className="transfer-amount-container">
                  {returnTransferLogo(transfer.symbol, chain)}
                  <div>{transfer.amount}</div>
                  <div>{transfer.name}</div>
                </div>
              </div>
            ),
        )}
      </div>
      <img className="tx-cube-image" src={txCube} alt="tx-background-cubes" />
    </div>
    <div id="transfer-arrow-container" className="transfer-column">
      <img src={txBackgroundCubes} alt="tx-background-cubes" />

      <TransferArrow />
      <div>
        <span>Network fee:</span> <p>{networkFee} GAS</p>
      </div>
      <div>
        <span>System fee:</span> <p>{systemFee} GAS</p>
      </div>
      <div>
        <span>Data size:</span> <p>{size.toLocaleString()} bytes</p>
      </div>
    </div>
    <div className="transfer-column detail-tile">
      <label>SENT TO</label>
      <img
        className="tx-cube-image sent-to-cube"
        src={txCube}
        alt="tx-background-cubes"
      />
      <div className="asset-transfer-details-container">
        {transfers.map(
          (transfer: Transfer) =>
            transfer.to && (
              <div key={uniqueId()} className="asset-transfer-detail-container">
                <div
                  className="link"
                  onClick={(): void => handleAddressClick(transfer.to)}
                  style={{ color: '#d355e7' }}
                >
                  {transfer.to}
                </div>
                <div className="transfer-amount-container">
                  {returnTransferLogo(transfer.symbol, chain)}
                  <div>{transfer.amount}</div>
                  <div>{transfer.name}</div>
                </div>
              </div>
            ),
        )}
      </div>
    </div>
  </div>
)

export default Transfer
