import React from 'react'
import { Link } from 'react-router-dom'
import { AddressTransaction } from '../AddressTransaction'
import TransactionTime from './TransactionTime'
import { ROUTES } from '../../../../../constants'
import { truncateHash } from '../../../../../utils/formatter'
import tokens from '../../../../../assets/nep5/svg'

type Props = {
  transaction: AddressTransaction
  chain: string
  network: string
}

const AddressTransactionMobileRow: React.FC<Props> = (props: Props) => {
  const { transaction, chain, network } = props

  return (
    <div className="address-transactions__card--mobile">
      <div className="horiz">
        <label className="weight-1">ID</label>
        <Link
          className="hash"
          to={`${ROUTES.TRANSACTION.url}/${chain}/${network}/${transaction.hash}`}
        >
          {truncateHash(transaction.hash, true)}
        </Link>
      </div>
      <div className="horiz">
        <label className="weight-1">Date</label>
        <TransactionTime time={transaction.time} />
      </div>
      {transaction.transfers.map(it => (
        <div
          className="address-transactions__card--mobile-items"
          key={it.from + it.to + it.amount}
        >
          <div className="horiz">
            <label className="weight-1">From</label>
            <Link
              className="hash"
              to={`${ROUTES.WALLET.url}/${chain}/${network}/${it.from}`}
            >
              <span className="text-primary">
                {truncateHash(it.from, true)}
              </span>
            </Link>
          </div>
          <div className="horiz">
            <label className="weight-1">To</label>
            <Link
              className="hash"
              to={`${ROUTES.WALLET.url}/${chain}/${network}/${it.to}`}
            >
              <span className="text-primary">{truncateHash(it.to, true)}</span>
            </Link>
          </div>
          <div className="horiz">
            <label className="weight-1">Symbol</label>
            <span>{truncateHash(it.name, true, 8)}</span>
          </div>
          <div className="horiz">
            <label className="weight-1">Amount</label>
            {tokens[it.icon ?? 'NEO'] && (
              <img
                width={15}
                height={10}
                src={tokens[it.icon ?? 'NEO']}
                alt=""
              />
            )}
            <span>{it.amount}</span>
          </div>
          <div className="horiz">
            <label className="weight-1">Type</label>
            <span>NEP-17 Transfer</span>
          </div>
        </div>
      ))}
      {!transaction.transfers.length && (
        <div className="horiz justify-center">
          <p>not found transfers</p>
        </div>
      )}
    </div>
  )
}

export default AddressTransactionMobileRow
