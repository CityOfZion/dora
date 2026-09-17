export interface ActivityHistoryEvent {
  amount: string
  contractHash: string
  contractName: string
  from: string | null
  methodName: string
  supportedStandards: string[] | null
  to: string | null
}

export interface ActivityHistoryItem {
  block: number
  date: string
  events: ActivityHistoryEvent[]
  invocationCount: number
  networkFeeAmount: string
  notificationCount: number
  systemFeeAmount: string
  transactionID: string
  transactionSender: string
}

export interface ActivityHistoryResponse {
  data: ActivityHistoryItem[]
  nextCursor?: string
}

const ACTIVITY_HISTORY_PAGE_SIZE = 15
const ACTIVITY_HISTORY_RANGE_DAYS = 364

export const fetchTransactions = async (
  address: string,
  network: string,
  cursor?: string,
): Promise<ActivityHistoryResponse> => {
  try {
    const timestampTo = new Date()
    const timestampFrom = new Date(
      timestampTo.getTime() - ACTIVITY_HISTORY_RANGE_DAYS * 24 * 60 * 60 * 1000,
    )
    const apiHost = import.meta.env.VITE_API_HOST || 'https://api.coz.io'
    const response = await fetch(`${apiHost}/api/v2/unified/activity-history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        address,
        network,
        protocol: 'neo3',
        timestampFrom: timestampFrom.toISOString(),
        timestampTo: timestampTo.toISOString(),
        pageLimit: ACTIVITY_HISTORY_PAGE_SIZE,
        ...(cursor ? { cursor } : {}),
      }),
    })

    if (!response.ok) {
      throw new Error(
        `Unable to load address transactions (${response.status})`,
      )
    }

    return (await response.json()) as ActivityHistoryResponse
  } catch (error) {
    console.error(error)
    return { data: [] }
  }
}
