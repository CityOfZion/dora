import React from 'react'
import { Notification, Transfer } from '../AddressTransaction'
import { formatAmount, truncateHash } from '../../../../../utils/formatter'
import { TransactionAddressLink } from '../../../../../components/transaction/TransactionAddressLink'
import { TokenIcon } from '../../../../../components/token-icon/TokenIcon'

type Props = {
  transfer: Transfer
  notifications: Notification[]
  chain: string
  network: string
}

const getTransferType = (transfer: Transfer, notifications: Notification[]) => {
  if (transfer.type) return transfer.type

  const notification = notifications.find(
    item => item.contract === transfer.scripthash,
  )

  if (notification?.state.length === 3) return 'NEP-17 Transfer'
  if (notification?.state.length === 4) return 'NEP-11 Transfer'
  return 'Transfer'
}

const AddressTransactionTransferEvent: React.FC<Props> = ({
  transfer,
  notifications,
  chain,
  network,
}) => {
  return (
    <div className="address-transactions__table--transfers-event">
      <div className="address-transactions__table--transfers-event-type">
        <span className="address-transactions__table--transfers-event-label">
          Type
        </span>
        <span className="address-transactions__table--transfers-event-type-value">
          {getTransferType(transfer, notifications)}
        </span>
      </div>

      <div className="address-transactions__table--transfers-event-details">
        <div className="address-transactions__table--transfers-event-field">
          <span className="address-transactions__table--transfers-event-label">
            From
          </span>
          <TransactionAddressLink
            address={transfer.from}
            chain={chain}
            network={network}
          />
        </div>

        <div className="address-transactions__table--transfers-event-field">
          <span className="address-transactions__table--transfers-event-label">
            To
          </span>
          <TransactionAddressLink
            address={transfer.to}
            chain={chain}
            network={network}
          />
        </div>

        <div className="address-transactions__table--transfers-event-field">
          <span className="address-transactions__table--transfers-event-label">
            Symbol
          </span>
          <span>{truncateHash(transfer.symbol, true, 10, 4)}</span>
        </div>

        <div className="address-transactions__table--transfers-event-field">
          <span className="address-transactions__table--transfers-event-label">
            Amount
          </span>
          <span className="address-transactions__table--transfers-event-amount">
            {transfer.symbol && transfer.symbol.length > 0 && (
              <TokenIcon
                blockchain={chain}
                hash={transfer.scripthash}
                symbol={transfer.symbol}
                className="address-transactions__image--token"
              />
            )}
            {formatAmount(transfer.amount)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default AddressTransactionTransferEvent
