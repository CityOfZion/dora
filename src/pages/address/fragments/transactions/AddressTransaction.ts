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
}
export interface Notification {
  contract: string
  event_name: string
  state: {
    type: string
    value: string
  }[]
}

export interface AddressTransaction {
  block: number
  hash: string
  invocations: Incovation[]
  netfee: string
  sender: string
  sysfee: string
  time: number
  transfers: Transfer[]
  vmstate: string
  notifications: Notification[]
}
