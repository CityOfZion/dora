import React from 'react'
import uniqueId from 'lodash/uniqueId'

import './Transfer.scss'

type Transfer = {
  from: string
  name: string
  to: string
  amount: string
}

const Transfer: React.FC<{
  transfers: Array<Transfer>
  handleAddressClick: (address: string) => void
}> = ({ transfers = [], handleAddressClick }) => (
  <div className="transfer-container">
    <div className="transfer-column">
      <div className="bold-subtitle">Sent From</div>
      {transfers.map((transfer: Transfer) => (
        <div key={uniqueId()} className="asset-transfer-detail-container">
          <div
            className="link"
            onClick={(): void => handleAddressClick(transfer.from)}
          >
            {transfer.from}
          </div>
          <div className="transfer-amount-container">
            {/* {tokens[transfer.name] && (
              <img src={tokens[transfer.name]} alt="token-logo" />
            )}{' '} */}
            {transfer.amount} {transfer.name}
          </div>
        </div>
      ))}
    </div>
    {/* <img id="chevron-right-transfer" src={chevronRight} alt="chevron-right" /> */}
    <div className="transfer-column">
      <div className="bold-subtitle">Sent To</div>
      {transfers.map((transfer: Transfer) => (
        <div key={uniqueId()} className="asset-transfer-detail-container">
          <div
            className="link"
            onClick={(): void => handleAddressClick(transfer.to)}
          >
            {transfer.to}
          </div>
          <div className="transfer-amount-container">
            {/* {tokens[transfer.name] && (
              <img src={tokens[transfer.name]} alt="token-logo" />
            )}{' '} */}
            {transfer.amount} {transfer.name}
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default Transfer
