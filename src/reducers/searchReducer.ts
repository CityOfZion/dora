import { AnyAction } from 'redux'

import {
  SEARCH_INPUT_ENTERED,
  SEARCH_INPUT_ENTERED_SUCCESS,
  SEARCH_INPUT_ENTERED_ERROR,
  CLEAR_SEARCH_INPUT_STATE,
  CLEAR_SEARCH_INPUT_ENTERED_ERROR,
} from '../actions/searchActions'

export type State = {
  isSearching: boolean
  searchType: null | string
  searchValue: null | string
  shouldClearSearch: boolean
  error: boolean
}

export type Action = {
  type: string
  searchType: string
  receivedAt: Date
  search: string
}

export default (
  state: State = {
    isSearching: false,
    searchType: null,
    searchValue: null,
    shouldClearSearch: false,
    error: false,
  },
  action: AnyAction | Action,
): State => {
  switch (action.type) {
    case SEARCH_INPUT_ENTERED:
      return Object.assign({}, state, {
        isSearching: true,
      })
    case SEARCH_INPUT_ENTERED_SUCCESS:
      return Object.assign({}, state, {
        isSearching: false,
        searchType: action.searchType,
        lastUpdated: action.receivedAt,
        searchValue: action.search,
        shouldClearSearch: true,
      })
    case SEARCH_INPUT_ENTERED_ERROR:
      return Object.assign({}, state, {
        isSearching: false,
        error: true,
      })
    case CLEAR_SEARCH_INPUT_ENTERED_ERROR:
      return Object.assign({}, state, {
        isSearching: false,
        error: false,
      })
    case CLEAR_SEARCH_INPUT_STATE:
      return Object.assign({}, state, {
        isSearching: false,
        searchType: null,
        searchValue: null,
        shouldClearSearch: false,
        error: false,
      })
    default:
      return state
  }
}
