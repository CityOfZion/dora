import React from 'react'
import {
  Notification,
  NotificationEvent,
  Transfer,
} from '../AddressTransaction'
import AddressTransactionTransferEvent from './AddressTransactionTransferEvent'
import AddressTransactionNotificationEvent from './AddressTransactionNotificationEvent'

type Props = {
  transfers: Transfer[]
  events: NotificationEvent[]
  notifications: Notification[]
  chain: string
  network: string
}

const AddressTransactionTransfer: React.FC<Props> = ({
  transfers,
  events,
  notifications,
  ...props
}: Props) => {
  return (
    <div className="address-transactions__table--transfers-events">
      {transfers.map((transfer, index) => (
        <AddressTransactionTransferEvent
          key={`${transfer.scripthash}-${transfer.from}-${transfer.to}-${index}`}
          transfer={transfer}
          notifications={notifications}
          {...props}
        />
      ))}
      {events.map((event, index) => (
        <AddressTransactionNotificationEvent
          key={`${event.contractHash}-${event.type}-${index}`}
          event={event}
          {...props}
        />
      ))}
    </div>
  )
}

export default AddressTransactionTransfer
