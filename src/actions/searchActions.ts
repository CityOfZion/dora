import isEmpty from 'lodash/isEmpty'
import { ThunkDispatch } from 'redux-thunk'
import { Dispatch, Action } from 'redux'

import { GENERATE_BASE_URL, SEARCH_TYPES } from '../constants'
import { State } from '../reducers/searchReducer'

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
  networkInfo: {
    chain: string
    network: string
  },
  results?: {},
) => (dispatch: Dispatch): void => {
  dispatch({
    type: SEARCH_INPUT_ENTERED_SUCCESS,
    searchType,
    networkInfo,
    search,
    results: results,
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

export function handleSearchInput(rawSearch: string, network: string) {
  return async (
    dispatch: ThunkDispatch<State, void, Action>,
  ): Promise<void> => {
    const search = rawSearch.replace(',', '')
    dispatch(searchInputEntered(search))

    try {
      const { searchType, networkInfo, results } = await determineSearchType(
        search,
        network,
      )

      // TODO: returning the json here would prevent duplicate requests
      // but will introduce added complexity
      if (searchType) {
        dispatch(
          searchInputEnteredSuccess(search, searchType, networkInfo, results),
        )
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
export async function determineSearchType(
  search: string,
  network: string,
): Promise<{
  searchType: string
  networkInfo: {
    chain: string
    network: string
  }
  results?: {}
}> {
  const invokePromiseAndIgnoreError = (url: string): Promise<{}> =>
    fetch(url)
      .then(result => result && result.json())
      .catch(e => undefined)

  const urls = []

  urls.push(
    ...[
      `${GENERATE_BASE_URL('neo2', 'mainnet', false)}/transaction/${search}`,
      `${GENERATE_BASE_URL('neo2', 'mainnet', false)}/contract/${search}`,
      `${GENERATE_BASE_URL('neo3', 'testnet', false)}/transaction/${search}`,
      `${GENERATE_BASE_URL('neo3', 'testnet', false)}/contract/${search}`,
      `${GENERATE_BASE_URL('neo2', 'mainnet', false)}/balance/${search}`,
      `${GENERATE_BASE_URL('neo2', 'mainnet', false)}/block/${search}`,
      `${GENERATE_BASE_URL('neo3', 'testnet', false)}/balance/${search}`,
      `${GENERATE_BASE_URL('neo3', 'testnet', false)}/block/${search}`,
    ],
  )

  const results = await Promise.all(
    urls
      .map(url => invokePromiseAndIgnoreError.bind(null, url))
      .map(req => req()),
  )

  const searchResults = {
    searchType: '',
    networkInfo: {
      chain: 'neo2',
      network: network || 'mainnet',
    },
  }

  const [
    transaction,
    contract,
    neo3Transaction,
    neo3Contract,
    balance,
    block,
    neo3Balance,
    neo3Block,
  ] = results

  if (!isEmpty(transaction)) {
    searchResults.searchType = SEARCH_TYPES.TRANSACTION
  }

  if (contract) {
    searchResults.searchType = SEARCH_TYPES.CONTRACT
  }

  if (!isEmpty(neo3Transaction)) {
    searchResults.searchType = SEARCH_TYPES.TRANSACTION
    searchResults.networkInfo.chain = 'neo3'
  }

  if (neo3Contract) {
    searchResults.searchType = SEARCH_TYPES.CONTRACT
    searchResults.networkInfo.chain = 'neo3'
  }

  if (balance && !isEmpty(balance)) {
    searchResults.searchType = SEARCH_TYPES.ADDRESS
  }

  if (block && neo3Block) {
    return {
      searchType: SEARCH_TYPES.MULTIPLE_RESULTS,
      results: {
        block: { ...block, chain: 'neo2' },
        neo3Block: { ...neo3Block, chain: 'neo3' },
      },
      networkInfo: {
        chain: '',
        network: network || 'mainnet',
      },
    }
  }

  if (block) {
    searchResults.searchType = SEARCH_TYPES.BLOCK
  }

  if (neo3Balance && !isEmpty(neo3Balance)) {
    searchResults.searchType = SEARCH_TYPES.ADDRESS
    searchResults.networkInfo.chain = 'neo3'
  }

  return searchResults
}
