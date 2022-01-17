import { AnyAction } from 'redux'

export enum ActionType {
  REQUEST_NFTS = 'REQUEST_NFTS',
  REQUEST_NFTS_SUCCESS = 'REQUEST_NFTS_SUCCESS',
  REQUEST_NFTS_ERROR = 'REQUEST_NFTS_ERROR',
  CLEAR_NFTS_LIST = 'CLEAR_NFTS_LIST',
}

type Action = {
  type: ActionType
  all: NFT[]
  error: Error
  page: number
  total: number
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
  page: number | null
  total: number | null
}

const INITIAL_STATE = {
  isLoading: false,
  all: [],
  error: null,
  page: null,
  total: null,
}

export default (
  state: State = INITIAL_STATE,
  action: AnyAction | Action,
): State => {
  switch (action.type) {
    case ActionType.REQUEST_NFTS:
      return Object.assign({}, state, {
        isLoading: true,
        page: action.page,
      })

    case ActionType.REQUEST_NFTS_SUCCESS:
      return Object.assign({}, state, {
        isLoading: false,
        all: [...state.all, ...action.all],
        page: action.page,
        total: action.total,
      })
    case ActionType.REQUEST_NFTS_ERROR:
      return Object.assign({}, state, {
        isLoading: false,
        error: action.error,
        page: action.page,
      })
    case ActionType.CLEAR_NFTS_LIST:
      return INITIAL_STATE
    case 'RESET':
      return INITIAL_STATE
    default:
      return state
  }
}
