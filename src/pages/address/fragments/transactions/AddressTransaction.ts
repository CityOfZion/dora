export interface Incovation {
  type: string
  metadata: {
    summary: string
    contract_name: string
    scripthash: string
    method: string
  }
}
export interface Transfer {
  from: string
  to: string
  scripthash: string
  amount: number
  symbol?: string
  type?: string
}
export interface Notification {
  contract: string
  event_name: string
  state: {
    type: string
    value: string
  }[]
}

export interface NotificationEventField {
  label: string
  value: string
  type?: 'address'
}

export interface NotificationEvent {
  contractHash: string
  contractName: string
  fields: NotificationEventField[]
  type: string
}

export interface AddressTransaction {
  block: number
  hash: string
  invocations: Incovation[]
  invocationCount?: number
  netfee: string
  sender: string
  sysfee: string
  time: number
  transfers: Transfer[]
  vmstate: string
  notifications: Notification[]
  notificationCount?: number
  events: NotificationEvent[]
}
