import React from 'react'
import uniqueId from 'lodash/uniqueId'

import { ReactComponent as TransferArrow } from '../../assets/icons/transfer-arrow.svg'
import tokens from '../../assets/nep5/svg'
import txBackgroundCubes from '../../assets/tx_mask.svg'
import txCube from '../../assets/tx_cube.svg'

import './Transfer.scss'

type Transfer = {
  from: string
  name: string
  to: string
  amount: string | number
}

const Transfer: React.FC<{
  transfers: Array<Transfer>
  handleAddressClick: (address: string) => void
  size: string
  networkFee: string
  systemFee: string
}> = ({ transfers = [], handleAddressClick, networkFee, systemFee, size }) => (
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
                >
                  {transfer.from}
                </div>
                <div className="transfer-amount-container">
                  {tokens[transfer.name] && (
                    <img src={tokens[transfer.name]} alt="token-logo" />
                  )}{' '}
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
                >
                  {transfer.to}
                </div>
                <div className="transfer-amount-container">
                  {tokens[transfer.name] && (
                    <img src={tokens[transfer.name]} alt="token-logo" />
                  )}{' '}
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
