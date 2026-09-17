import React from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../../../../constants'
import { truncateHash } from '../../../../../utils/formatter'
import { TransactionAddressLink } from '../../../../../components/transaction/TransactionAddressLink'
import { NotificationEvent } from '../AddressTransaction'

type Props = {
  event: NotificationEvent
  chain: string
  network: string
}

const AddressTransactionNotificationEvent: React.FC<Props> = ({
  event,
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
          {event.type}
        </span>
      </div>

      <div className="address-transactions__table--transfers-event-details">
        <div className="address-transactions__table--transfers-event-field">
          <span className="address-transactions__table--transfers-event-label">
            Contract
          </span>
          <Link
            className="address-transactions__table--event-contract"
            to={`${ROUTES.CONTRACT.url}/${chain}/${network}/${event.contractHash}`}
          >
            <span>{event.contractName}</span>
            <small>{truncateHash(event.contractHash, true, 10, 4)}</small>
          </Link>
        </div>

        {event.fields.map(field => (
          <div
            className="address-transactions__table--transfers-event-field"
            key={field.label}
          >
            <span className="address-transactions__table--transfers-event-label">
              {field.label}
            </span>
            {field.type === 'address' ? (
              <TransactionAddressLink
                address={field.value}
                chain={chain}
                network={network}
              />
            ) : (
              <span>{field.value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AddressTransactionNotificationEvent
