export type TransactionLog = {
  exception: string | null
  gas_consumed: string
  notifications: [
    {
      contract: string
      event_name: string
      state: {
        type: string
        value: [{ type: string; value: string }]
      }
    },
  ]
  stack: [{ type: string; value: boolean }]
  time: string
  trigger: string
  txid: string
  vmstate: string
}
