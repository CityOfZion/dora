import React from 'react'
import { Link } from 'react-router-dom'
import { AddressTransaction } from '../AddressTransaction'
import TransactionTime from './TransactionTime'
import { ROUTES } from '../../../../../constants'
import { truncateHash } from '../../../../../utils/formatter'
import AddressTransactionEvents from './AddressTransactionTransferRow'

type Props = {
  transaction: AddressTransaction
  chain: string
  network: string
}

const AddressTransactionMobileRow: React.FC<Props> = (props: Props) => {
  const { transaction, chain, network } = props

  return (
    <div className="address-transactions__card--mobile">
      <div className="address-transactions__card--mobile-row">
        <label>ID</label>
        <Link
          className="hash"
          to={`${ROUTES.TRANSACTION.url}/${chain}/${network}/${transaction.hash}`}
        >
          {truncateHash(transaction.hash, true)}
        </Link>
      </div>
      <div className="address-transactions__card--mobile-row">
        <label>Date</label>
        <TransactionTime time={transaction.time} />
      </div>
      <AddressTransactionEvents
        transfers={transaction.transfers}
        events={transaction.events}
        notifications={transaction.notifications}
        chain={chain}
        network={network}
      />
      {!transaction.transfers.length && !transaction.events.length && (
        <div className="horiz justify-center">
          <p>No events</p>
        </div>
      )}
    </div>
  )
}

export default AddressTransactionMobileRow
