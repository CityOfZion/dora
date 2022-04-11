import React from 'react'
import uniqueId from 'lodash/uniqueId'

import { ReactComponent as TransferArrow } from '../../assets/icons/transfer-arrow.svg'
import txBackgroundCubes from '../../assets/tx_mask.svg'
import txCube from '../../assets/tx_cube.svg'

import './Transfer.scss'
import { getLogo } from '../../utils/getLogo'
import { DetailedTransaction } from '../../reducers/transactionReducer'
import { useHistory } from 'react-router-dom'
import { convertToArbitraryDecimals } from '../../utils/formatter'

type Transfer = {
  from: string
  name: string
  to: string
  amount: string | number
  symbol: string
}

type Props = {
  transfers: Array<Transfer>
  network: string
  transaction: DetailedTransaction
  chain: string
}

function getTransferLogo(symbol: string, chain: string): React.ReactNode {
  const icon = getLogo(symbol, chain)

  return icon && <img src={icon} className="icon" alt="token-logo" />
}

const Transfer = ({ transfers = [], network, transaction, chain }: Props) => {
  const history = useHistory()

  function handleAddressClick(address: string) {
    history.push(`/address/${chain}/${network}/${address}`)
  }

  function getNetworkFee() {
    return chain === 'neo2'
      ? transaction.net_fee
      : String(convertToArbitraryDecimals(Number(transaction.netfee), 8))
  }

  function getSystemfee() {
    return chain === 'neo2'
      ? transaction.sys_fee
      : String(convertToArbitraryDecimals(Number(transaction.sysfee), 8))
  }

  function getSize() {
    return transaction.size.toLocaleString()
  }

  return (
    <div className="transfer-container">
      <div className="transfer-column detail-tile">
        <label>SENT FROM</label>
        <div className="asset-transfer-details-container">
          {transfers.map(
            (transfer: Transfer) =>
              transfer.from && (
                <div
                  key={uniqueId()}
                  className="asset-transfer-detail-container"
                >
                  <div
                    className="link"
                    onClick={() => handleAddressClick(transfer.from)}
                  >
                    {transfer.from}
                  </div>
                  <div className="transfer-amount-container">
                    {getTransferLogo(transfer.symbol, chain)}
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
          <span>Network fee:</span> <p>{getNetworkFee()} GAS</p>
        </div>
        <div>
          <span>System fee:</span> <p>{getSystemfee()} GAS</p>
        </div>
        <div>
          <span>Data size:</span> <p>{getSize()} bytes</p>
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
                <div
                  key={uniqueId()}
                  className="asset-transfer-detail-container"
                >
                  <div
                    className="link"
                    onClick={() => handleAddressClick(transfer.to)}
                  >
                    {transfer.to}
                  </div>
                  <div className="transfer-amount-container">
                    {getTransferLogo(transfer.symbol, chain)}
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
}

export default Transfer
