import { AnyAction } from 'redux'

import {
  REQUEST_CONTRACT,
  REQUEST_CONTRACTS,
  REQUEST_CONTRACTS_SUCCESS,
  REQUEST_CONTRACT_SUCCESS,
  CLEAR_CONTRACTS_LIST,
} from '../actions/contractActions'

type Action = {
  type: string
  receivedAt: Date
  hash: string
  json: {
    hash: string
  }
  page: number
}

export type State = {
  isLoading: boolean
  cached: { [key: string]: Contract }
  list: []
  lastUpdated: Date | null
  contract: DetailedContract | null
  page: number
}

export type Contract = {
  block: number
  time: number
  idx: number
  hash: string
}

export type DetailedContract = {
  block: number
  time: number
  hash: string
  email: string
  name: string
  script: string
}

export default (
  state: State = {
    isLoading: false,
    cached: {},
    list: [],
    lastUpdated: null,
    contract: null,
    page: 1,
  },
  action: AnyAction | Action,
): State => {
  switch (action.type) {
    case REQUEST_CONTRACT:
      return Object.assign({}, state, {
        isLoading: true,
      })
    case REQUEST_CONTRACTS:
      return Object.assign({}, state, {
        isLoading: true,
      })
    case REQUEST_CONTRACT_SUCCESS:
      return Object.assign({}, state, {
        isLoading: false,
        contract: action.json,
        lastUpdated: action.receivedAt,
        cached: {
          [action.json.hash]: action.json,
        },
      })
    case REQUEST_CONTRACTS_SUCCESS:
      return Object.assign({}, state, {
        isLoading: false,
        list: [...state.list, ...action.json.contracts],
        totalCount: action.json.totalCount,
        lastUpdated: action.receivedAt,
        page: action.page,
      })
    case CLEAR_CONTRACTS_LIST:
      return Object.assign({}, state, {
        list: [],
        page: 0,
      })
    default:
      return state
  }
}
