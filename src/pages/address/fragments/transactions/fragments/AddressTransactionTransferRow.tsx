import React from 'react'
import { Transfer, Notification } from '../AddressTransaction'
import { formatAmount, truncateHash } from '../../../../../utils/formatter'
import { TransactionAddressLink } from '../../../../../components/transaction/TransactionAddressLink'
import { TokenIcon } from '../../../../../components/token-icon/TokenIcon'

type Props = {
  transfers: Transfer[]
  notifications: Notification[]
  chain: string
  network: string
}

const AddressTransactionTransfer: React.FC<Props> = ({
  transfers,
  notifications,
  ...props
}: Props) => {
  return (
    <div className="address-transactions__table--transfers-items">
      {transfers.length > 0 && (
        <>
          <div className="address-transactions__table--transfers-labels">
            <label>From</label>
            <label>To</label>
            <label>Symbol</label>
            <label>Amount</label>
            <label>Type</label>
          </div>

          {transfers.map(transfer => {
            const notification = notifications.find(
              notification => notification.contract === transfer.scripthash,
            )
            const type =
              notification?.state.length === 3
                ? 'NEP-17 Transfer'
                : notification?.state.length === 4
                  ? 'NEP-11 Transfer'
                  : 'Transfer'
            return (
              <div
                className="address-transactions__table--transfers-values"
                key={transfer.from + transfer.to + transfer.amount}
              >
                <TransactionAddressLink address={transfer.from} {...props} />
                <TransactionAddressLink address={transfer.to} {...props} />

                <span className="whitespace-no-wrap">
                  {truncateHash(transfer.symbol, true, 10, 4)}
                </span>
                <span className="whitespace-no-wrap">
                  {transfer.symbol && transfer.symbol.length > 0 && (
                    <TokenIcon
                      blockchain={props.chain}
                      hash={transfer.scripthash}
                      symbol={transfer.symbol}
                      className="address-transactions__image--token"
                    />
                  )}
                  {formatAmount(transfer.amount)}
                </span>
                <span>{type}</span>
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}

export default AddressTransactionTransfer
