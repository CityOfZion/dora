import React from 'react'
import { Transfer, Notification } from '../AddressTransaction'
import tokens from '../../../../../assets/nep5/svg'
import { truncateHash } from '../../../../../utils/formatter'
import { TransactionAddressLink } from '../../../../../components/transaction/TransactionAddressLink'

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
                  {tokens[transfer.symbol ?? 'NEO'] && (
                    <img
                      width={15}
                      height={10}
                      src={tokens[transfer.symbol ?? 'NEO']}
                      alt=""
                    />
                  )}
                  {transfer.amount}
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
