import { AnyAction } from 'redux'

import {
  REQUEST_BLOCK,
  REQUEST_BLOCK_SUCCESS,
  REQUEST_BLOCKS,
  REQUEST_BLOCKS_SUCCESS,
  CLEAR_BLOCKS_LIST,
} from '../actions/blockActions'

type Action = {
  type: string
  receivedAt: Date
  indexOrHash: string
  blockHeight: string
  json: {
    hash: string
  }
  page: number
}

export type State = {
  isLoading: boolean
  cached: { [key: string]: DetailedBlock }
  list: Block[]
  lastUpdated: Date | null
  block: DetailedBlock | null
  page: number
}

export type Block = {
  index: number
  time: number
  size: number
  tx: Array<string>
  blocktime: number
  hash: string
  txCount: number
}

export type DetailedBlock = {
  nextconsensus: string
  oversize: number
  tx: []
  previousblockhash: string
  index: number
  version: number
  nonce: string
  script: {
    invocation: string
    verification: string
  }
  size: number
  blocktime: number
  merkleroot: string
  time: number
  hash: string
  jsonsize: number
}

export default (
  state: State = {
    isLoading: false,
    cached: {},
    list: [],
    lastUpdated: null,
    block: null,
    page: 1,
  },
  action: AnyAction | Action,
): State => {
  switch (action.type) {
    case REQUEST_BLOCK:
      return Object.assign({}, state, {
        isLoading: true,
        block: null,
      })
    case REQUEST_BLOCKS:
      return Object.assign({}, state, {
        isLoading: true,
      })
    case REQUEST_BLOCK_SUCCESS:
      return Object.assign({}, state, {
        isLoading: false,
        block: action.json,
        lastUpdated: action.receivedAt,
        // cache both the index and the hash in memory
        cached: {
          [action.json.index]: action.json,
          [action.json.hash]: action.json,
          ...state.cached,
        },
      })
    case REQUEST_BLOCKS_SUCCESS:
      return Object.assign({}, state, {
        isLoading: false,
        list: [...state.list, ...action.json.items],
        totalCount: action.json.totalCount,
        lastUpdated: action.receivedAt,
        page: action.page,
      })
    case CLEAR_BLOCKS_LIST:
      return Object.assign({}, state, {
        list: [],
        page: 0,
      })
    default:
      return state
  }
}
