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
  neo2List: Block[]
  neo3List: Block[]
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
  chain?: string
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

export const INITIAL_STATE = {
  isLoading: false,
  cached: {},
  neo2List: [],
  neo3List: [],
  lastUpdated: null,
  block: null,
  page: 1,
}

export default (
  state: State = INITIAL_STATE,
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
        neo2List: [...state.neo2List, ...action.json.neo2.items],
        neo3List: [...state.neo3List, ...action.json.neo3.items],
        totalCount: action.json.totalCount,
        lastUpdated: action.receivedAt,
        page: action.page,
      })
    case CLEAR_BLOCKS_LIST:
      return Object.assign({}, state, {
        neo2List: [],
        neo3List: [],
        page: 0,
      })
    case 'RESET':
      return INITIAL_STATE
    default:
      return state
  }
}
