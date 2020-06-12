import { AnyAction } from 'redux'

import {
  REQUEST_TRANSACTION,
  REQUEST_TRANSACTIONS,
  REQUEST_TRANSACTIONS_SUCCESS,
  REQUEST_TRANSACTION_SUCCESS,
  CLEAR_TRANSACTIONS_LIST,
} from '../actions/transactionActions'

type Action = {
  type: string
  receivedAt: Date
  indexOrHash: string
  blockHeight: string
  json: {
    hash: string
  }
  cursor: string
}

export type State = {
  isLoading: boolean
  cached: { [key: string]: Transaction }
  list: []
  lastUpdated: Date | null
  transaction: Transaction | null
  cursor: string
}

export type Transaction = {
  size: number
  time: number
  txid: string
}

export type BlockTransaction = {
  size: number
  time: number
  txid: string
  type: string
}

export default (
  state: State = {
    isLoading: false,
    cached: {},
    list: [],
    lastUpdated: null,
    transaction: null,
    cursor: '',
  },
  action: AnyAction | Action,
): State => {
  switch (action.type) {
    case REQUEST_TRANSACTION:
      return Object.assign({}, state, {
        isLoading: true,
      })
    case REQUEST_TRANSACTIONS:
      return Object.assign({}, state, {
        isLoading: true,
      })
    case REQUEST_TRANSACTION_SUCCESS:
      return Object.assign({}, state, {
        isLoading: false,
        transaction: action.json,
        lastUpdated: action.receivedAt,
        cached: {
          [action.json.hash]: action.json,
        },
      })
    case REQUEST_TRANSACTIONS_SUCCESS:
      return Object.assign({}, state, {
        isLoading: false,
        list: [...state.list, ...action.json.transactions],
        totalCount: action.json.totalCount,
        lastUpdated: action.receivedAt,
        cursor: action.cursor,
      })
    case CLEAR_TRANSACTIONS_LIST:
      return Object.assign({}, state, {
        list: [],
        cursor: '',
      })
    default:
      return state
  }
}
