import {
  REQUEST_ADDRESS,
  REQUEST_ADDRESS_SUCCESS,
  REQUEST_ADDRESS_TRANSFER_HISTORY,
  REQUEST_ADDRESS_TRANSFER_HISTORY_SUCCESS,
} from '../actions/addressActions'

type Action = {
  type: string
  receivedAt: Date
  indexOrHash: string
  requestedAddress: string
  json: {
    items: number
    totalCount: number
  }
  transferHistoryPage: number
}

export type State = {
  isLoading: boolean
  transferHistoryLoading: boolean
  requestedAddress: string
  balance: []
  transferHistory: []
  transferHistoryPage: number
}

export type Block = {}

export default (
  state: State = {
    isLoading: false,
    transferHistoryLoading: false,
    requestedAddress: '',
    balance: [],
    transferHistory: [],
    transferHistoryPage: 1,
  },
  action: Action,
): State => {
  switch (action.type) {
    case REQUEST_ADDRESS:
      return Object.assign({}, state, {
        isLoading: true,
        transferHistory: [],
      })
    case REQUEST_ADDRESS_SUCCESS:
      return Object.assign({}, state, {
        isLoading: false,
        requestedAddress: action.requestedAddress,
        balance: action.json,
        lastUpdated: action.receivedAt,
      })
    case REQUEST_ADDRESS_TRANSFER_HISTORY:
      return Object.assign({}, state, {
        transferHistoryLoading: true,
      })
    case REQUEST_ADDRESS_TRANSFER_HISTORY_SUCCESS:
      return Object.assign({}, state, {
        transferHistoryLoading: false,
        transferHistory: action.json.items,
        totalCount: action.json.totalCount,
        lastUpdated: action.receivedAt,
        transferHistoryPage: action.transferHistoryPage,
      })

    default:
      return state
  }
}
