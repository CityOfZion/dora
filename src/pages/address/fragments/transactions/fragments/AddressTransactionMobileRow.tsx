import React from 'react'
import { Link } from 'react-router-dom'
import { AddressTransaction } from '../AddressTransaction'
import TransactionTime from './TransactionTime'
import { ROUTES } from '../../../../../constants'
import { formatAmount, truncateHash } from '../../../../../utils/formatter'
import { TransactionAddressLink } from '../../../../../components/transaction/TransactionAddressLink'
import { TokenIcon } from '../../../../../components/token-icon/TokenIcon'

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
            <TransactionAddressLink
              address={it.from}
              linkClassName="hash"
              {...props}
            />
          </div>
          <div className="horiz">
            <label className="weight-1">To</label>
            <TransactionAddressLink
              address={it.to}
              linkClassName="hash"
              {...props}
            />
          </div>
          <div className="horiz">
            <label className="weight-1">Symbol</label>
            <span>{truncateHash(it.symbol, true, 10, 4)}</span>
          </div>
          <div className="horiz">
            <label className="weight-1">Amount</label>
            {it.symbol && it.symbol.length > 0 && (
              <TokenIcon
                blockchain={chain}
                hash={it.scripthash}
                symbol={it.symbol}
                className="address-transactions__image--token-mobile"
              />
            )}
            <span>{formatAmount(it.amount)}</span>
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
