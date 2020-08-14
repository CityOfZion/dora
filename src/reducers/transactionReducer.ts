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
  hash: string
}

export type State = {
  isLoading: boolean
  cached: { [key: string]: DetailedTransaction }
  list: []
  lastUpdated: Date | null
  transaction: DetailedTransaction | null
  cursor: string
}

export type Transaction = {
  size: number
  time: number
  txid: string
  type: string
}

export type Vin = {
  txid: string
  vout: number
}

export type Vout = {
  address: string
  asset: string
  n: number
  value: string
}

export type TransactionTokenAbstract = {
  block: number
  txid: string
  scripthash: string
  from: string
  amount: string
  time: number
  transferindex: string
  to: string
}

export type TransactionIOAbstract = {
  address: string
  asset: string
  value: string
}

export type TransactionNotification = {
  contract: string
  state: { type: string; value: [{ type: string; value: string }] }
}

export type DetailedTransaction = {
  type: string
  size: string
  block: number
  time: number
  txid: string
  script: string
  scripts: [{ invocation: string; verification: string }]
  Item: {
    notifications: TransactionNotification[]
  }
  vin: Vin[]
  vout: Vout[]
  net_fee: string
  sys_fee: string
  items: {
    tokens: TransactionTokenAbstract[]
    inputs: TransactionIOAbstract[]
    outputs: TransactionIOAbstract[]
  }
}

export type BlockTransaction = {
  size: number
  time: number
  txid: string
  type: string
}

export const INITIAL_STATE = {
  isLoading: false,
  cached: {},
  list: [],
  lastUpdated: null,
  transaction: null,
  cursor: '',
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
        transaction: null,
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
          [action.hash]: action.json,
          ...state.cached,
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
    case 'RESET':
      // eslint-disable-next-line
      // @ts-ignore
      return INITIAL_STATE
    default:
      return state
  }
}
