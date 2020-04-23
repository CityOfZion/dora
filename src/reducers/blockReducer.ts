import { AnyAction } from 'redux'

import { REQUEST_BLOCK, REQUEST_BLOCK_SUCCESS } from '../actions/blockActions'

type Action = {
  type: string
  receivedAt: Date
  indexOrHash: string
  blockHeight: string
  json: {
    hash: string
  }
}

export type State = {
  isLoading: boolean
  cached: {
    [key: string]: Block
  }
  list: []
  lastUpdated: Date | null
  block: Block | null
}

export type Block = {
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
  },
  // TODO: Figure out why this needs to be here
  action: AnyAction | Action,
): State => {
  switch (action.type) {
    case REQUEST_BLOCK:
      return Object.assign({}, state, {
        isLoading: true,
        block: state.cached[action.indexOrHash],
      })
    case REQUEST_BLOCK_SUCCESS:
      return Object.assign({}, state, {
        isLoading: false,
        block: action.json,
        lastUpdated: action.receivedAt,
        // cache both the index and the hash in memory
        cached: {
          [action.blockHeight]: action.json,
          [action.json.hash]: action.json,
        },
      })
    default:
      return state
  }
}
