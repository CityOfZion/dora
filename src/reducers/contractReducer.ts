import { AnyAction } from 'redux'

import {
  REQUEST_CONTRACT,
  REQUEST_CONTRACTS,
  REQUEST_CONTRACTS_SUCCESS,
  REQUEST_CONTRACT_SUCCESS,
  CLEAR_CONTRACTS_LIST,
  REQUEST_CONTRACTS_INVOCATIONS,
  REQUEST_CONTRACTS_INVOCATIONS_SUCCESS,
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
  list: Contract[]
  lastUpdated: Date | null
  contract: DetailedContract | null
  contractsInvocations: []
  page: number
  hasFetchedContractsInvocations: boolean
  totalCount: number
}

export type Contract = {
  block: number
  time: number
  name?: string
  hash: string
  idx: number
  author?: string
  asset_name: string
  symbol: string
  type: string
}

export type InvocationStat = {
  [date: string]: number
}

export type DetailedContract = {
  block: number
  time: number
  hash: string
  email: string
  name: string
  script: string
  idx: number
  returntype: string
  invocationStats: InvocationStat
}

export const INITIAL_STATE = {
  isLoading: false,
  cached: {},
  list: [],
  contractsInvocations: [],
  hasFetchedContractsInvocations: false,
  lastUpdated: null,
  contract: null,
  page: 1,
  totalCount: 0,
}

export default (
  state: State = {
    isLoading: false,
    cached: {},
    list: [],
    contractsInvocations: [],
    hasFetchedContractsInvocations: false,
    lastUpdated: null,
    contract: null,
    page: 1,
    totalCount: 0,
  },
  action: AnyAction | Action,
): State => {
  switch (action.type) {
    case REQUEST_CONTRACT:
      return Object.assign({}, state, {
        isLoading: true,
        contract: null,
      })
    case REQUEST_CONTRACTS:
    case REQUEST_CONTRACTS_INVOCATIONS:
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
        list: [...state.list, ...action.json.items],
        totalCount: action.json.totalCount,
        lastUpdated: action.receivedAt,
        page: action.page,
      })
    case REQUEST_CONTRACTS_INVOCATIONS_SUCCESS:
      return Object.assign({}, state, {
        isLoading: false,
        contractsInvocations: action.json,
        lastUpdated: action.receivedAt,
        hasFetchedContractsInvocations: true,
      })
    case CLEAR_CONTRACTS_LIST:
      return Object.assign({}, state, {
        list: [],
        page: 0,
      })

    case 'RESET':
      // eslint-disable-next-line
      // @ts-ignore
      return INITIAL_STATE
    default:
      return state
  }
}
