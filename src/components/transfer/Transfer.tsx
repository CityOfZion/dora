import React from 'react'
import uniqueId from 'lodash/uniqueId'

import { ReactComponent as TransferArrow } from '../../assets/icons/transfer-arrow.svg'
import tokens from '../../assets/tokens'

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
                  {transfer.amount} {transfer.name}
                </div>
              </div>
            ),
        )}
      </div>
    </div>
    <div id="transfer-arrow-container" className="transfer-column">
      <TransferArrow />
      <div>
        <span>Network Fee:</span> <p>{networkFee} GAS</p>
      </div>
      <div>
        <span>System Fee:</span> <p>{systemFee} GAS</p>
      </div>
      <div>
        <span>Data Size:</span> <p>{size.toLocaleString()} bytes</p>
      </div>
    </div>
    <div className="transfer-column detail-tile">
      <label>SENT TO</label>
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
                  {transfer.amount} {transfer.name}
                </div>
              </div>
            ),
        )}
      </div>
    </div>
  </div>
)

export default Transfer
