import isEmpty from 'lodash/isEmpty'
import { ThunkDispatch } from 'redux-thunk'
import { Dispatch, Action } from 'redux'

import { GENERATE_BASE_URL, SEARCH_TYPES } from '../constants'
import { State } from '../reducers/searchReducer'
import { Balance } from '../reducers/addressReducer'

export const SEARCH_INPUT_ENTERED = 'SEARCH_INPUT_ENTERED'
export const searchInputEntered = (search: string) => (
  dispatch: Dispatch,
): void => {
  dispatch({
    type: SEARCH_INPUT_ENTERED,
    search,
  })
}

export const SEARCH_INPUT_ENTERED_SUCCESS = 'SEARCH_INPUT_ENTERED_SUCCESS'
export const searchInputEnteredSuccess = (
  search: string,
  searchType: string,
) => (dispatch: Dispatch): void => {
  dispatch({
    type: SEARCH_INPUT_ENTERED_SUCCESS,
    searchType,
    search,
    receivedAt: Date.now(),
  })
}

export const UPDATE_SEARCH_INPUT = 'UPDATE_SEARCH_INPUT'
export const updateSearchInput = (search: string) => (
  dispatch: Dispatch,
): void => {
  dispatch({
    type: UPDATE_SEARCH_INPUT,
    search,
    receivedAt: Date.now(),
  })
}

export const SEARCH_INPUT_ENTERED_ERROR = 'SEARCH_INPUT_ENTERED_ERROR'
export const searchInputEnteredError = (errorMessage: string) => (
  dispatch: Dispatch,
): void => {
  dispatch({
    type: SEARCH_INPUT_ENTERED_ERROR,
    errorMessage,
    receivedAt: Date.now(),
  })
}

export const CLEAR_SEARCH_INPUT_STATE = 'CLEAR_SEARCH_INPUT'
export const clearSearchInputState = () => (dispatch: Dispatch): void => {
  dispatch({
    type: CLEAR_SEARCH_INPUT_STATE,
  })
}

export const CLEAR_SEARCH_INPUT_ENTERED_ERROR =
  'CLEAR_SEARCH_INPUT_ENTERED_ERROR'
export const clearSearchInputError = () => (dispatch: Dispatch): void => {
  dispatch({
    type: CLEAR_SEARCH_INPUT_ENTERED_ERROR,
  })
}

export function handleSearchInput(rawSearch: string) {
  return async (
    dispatch: ThunkDispatch<State, void, Action>,
  ): Promise<void> => {
    const search = rawSearch.replace(',', '')
    dispatch(searchInputEntered(search))

    try {
      const searchType = await determineSearchType(search)
      // TODO: returning the json here would prevent duplicate requests
      // but will introduce added complexity
      if (searchType) {
        dispatch(searchInputEnteredSuccess(search, searchType))
        return dispatch(clearSearchInputState())
      }

      return dispatch(searchInputEnteredError('No results found.'))
    } catch (e) {
      dispatch(searchInputEnteredError(e.message))
    }
  }
}

// TODO: refactor for performance optimization - we should
// dispatch the appropriate success action with the appropriate JSON payload
export async function determineSearchType(search: string): Promise<string> {
  const isPossibleTxOrContract = search.includes('0x')

  const invokePromiseAndIgnoreError = (url: string): Promise<{}> =>
    fetch(url)
      .then(result => result && result.json())
      .catch(e => undefined)

  const urls = []

  if (isPossibleTxOrContract) {
    urls.push(
      ...[
        `${GENERATE_BASE_URL()}/transaction/${search}`,
        `${GENERATE_BASE_URL()}/contract/${search}`,
      ],
    )
  } else {
    urls.push(
      ...[
        `${GENERATE_BASE_URL()}/balance/${search}`,
        `${GENERATE_BASE_URL()}/block/${search}`,
      ],
    )
  }

  const results = await Promise.all(
    urls
      .map(url => invokePromiseAndIgnoreError.bind(null, url))
      .map(req => req()),
  )

  if (isPossibleTxOrContract) {
    const [transaction, contract] = results
    if (!isEmpty(transaction)) return SEARCH_TYPES.TRANSACTION
    if (contract) return SEARCH_TYPES.CONTRACT
  } else {
    const balance = results[0] as Balance[]
    const block = results[1]

    if (balance && balance.length) return SEARCH_TYPES.ADDRESS
    if (block) return SEARCH_TYPES.BLOCK
  }

  return ''
}
