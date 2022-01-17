import React from 'react'
import Neo2 from '../../../../../assets/icons/neo2.svg'
import Neo3 from '../../../../../assets/icons/neo3.svg'
import { toBigNumber } from '../../../../../utils/formatter'
import { Transfer } from '../AddressTransaction'
import { ROUTES } from '../../../../../constants'
import { Link } from 'react-router-dom'

type Props = {
  transfers: Transfer[]
  chain: string
  network: string
}

const AddressTransactionTransfer: React.FC<Props> = (props: Props) => {
  const { transfers, chain, network } = props

  return (
    <div className="address-transactions__table--transfers-items">
      <div className="address-transactions__table--transfers-labels">
        <label>From</label>
        <label>To</label>
        <label>Amount</label>
        <label>Type</label>
      </div>

      {transfers.map(transfer => (
        <div
          className="address-transactions__table--transfers-values"
          key={transfer.from + transfer.to + transfer.amount}
        >
          <Link
            to={`${ROUTES.WALLET.url}/${chain}/${network}/${transfer.from}`}
          >
            <span className="text-primary">{transfer.from}</span>
          </Link>
          <Link
            className="hash"
            to={`${ROUTES.WALLET.url}/${chain}/${network}/${transfer.to}`}
          >
            <span className="text-primary">{transfer.to}</span>
          </Link>
          <span>
            <img
              width={15}
              height={10}
              src={chain === 'neo2' ? Neo2 : Neo3}
              alt="token-logo"
            />
            {toBigNumber(transfer.amount || 0).toString()}
          </span>
          <span>NEP-17 Transfer</span>
        </div>
      ))}
    </div>
  )
}

export default AddressTransactionTransfer
