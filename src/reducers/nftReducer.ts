import { AnyAction } from 'redux'

export enum ActionType {
  REQUEST_NFTS = 'REQUEST_NFTS',
  REQUEST_NFT = 'REQUEST_NFT',
  REQUEST_NFTS_SUCCESS = 'REQUEST_NFTS_SUCCESS',
  REQUEST_NFT_SUCCESS = 'REQUEST_NFT_SUCCESS',
  REQUEST_NFTS_ERROR = 'REQUEST_NFTS_ERROR',
  REQUEST_NFT_ERROR = 'REQUEST_NFT_ERROR',
  CLEAR_NFTS_LIST = 'CLEAR_NFTS_LIST',
}

type Action = {
  type: ActionType
  all: NFT[]
  error: Error
  next: number
  value: NFT
  hasMore: boolean
}

export type NFTAttribute = {
  key?: string
  value: any
}

export type NFT = {
  id: string
  chain: string
  name: string
  image: string
  contract: string
  collection: {
    name: string
    image: string
  }
  attributes: NFTAttribute[]
}

export type DETAILED_NFT = {
  id: string
  chain: string
  symbol: string
  contract: string
  name: string
  image: string
  description: string
  creatorAddress: string
  creatorName: string
  ownerAddress: string
  apiUrl: string
  collection: {
    name: string
    image: string
  }
  attributes: NFTAttribute[]
}

export type State = {
  isLoading: boolean
  all: NFT[]
  error: Error | null
  next: string | null
  value: DETAILED_NFT | null
  hasMore: boolean | null
}

const INITIAL_STATE = {
  isLoading: false,
  all: [],
  error: null,
  cursor: null,
  next: null,
  value: null,
  hasMore: null,
}

export default (
  state: State = INITIAL_STATE,
  action: AnyAction | Action,
): State => {
  switch (action.type) {
    case ActionType.REQUEST_NFTS:
      return Object.assign({}, state, {
        isLoading: true,
        next: action.next,
      })

    case ActionType.REQUEST_NFT:
      return Object.assign({}, state, {
        isLoading: true,
      })

    case ActionType.REQUEST_NFTS_SUCCESS:
      return Object.assign({}, state, {
        isLoading: false,
        all: [...state.all, ...action.all],
        next: action.next,
        hasMore: action.hasMore,
      })

    case ActionType.REQUEST_NFT_SUCCESS:
      return Object.assign({}, state, {
        isLoading: false,
        value: action.value,
        hasMore: action.hasMore,
      })

    case ActionType.REQUEST_NFT_ERROR:
      return Object.assign({}, state, {
        isLoading: false,
        error: action.error,
        hasMore: action.hasMore,
      })

    case ActionType.REQUEST_NFTS_ERROR:
      return Object.assign({}, state, {
        isLoading: false,
        error: action.error,
        next: action.next,
        hasMore: action.hasMore,
      })
    case ActionType.CLEAR_NFTS_LIST:
      return INITIAL_STATE
    case 'RESET':
      return INITIAL_STATE
    default:
      return state
  }
}
