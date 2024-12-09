import { ThunkDispatch } from 'redux-thunk'
import { Dispatch, Action } from 'redux'
import { State } from '../reducers/searchReducer'
import { NeoRESTApi } from '@cityofzion/dora-ts/dist/api'

const NeoRest = new NeoRESTApi({
  doraUrl: 'https://dora.coz.io',
  endpoint: '/api/v2/neo3',
})

export const SEARCH_INPUT_ENTERED = 'SEARCH_INPUT_ENTERED'
export const searchInputEntered =
  (search: string) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: SEARCH_INPUT_ENTERED,
      search,
    })
  }

export const SEARCH_INPUT_ENTERED_SUCCESS = 'SEARCH_INPUT_ENTERED_SUCCESS'
export const searchInputEnteredSuccess =
  (search: string, searchType: string, results?: {}) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: SEARCH_INPUT_ENTERED_SUCCESS,
      searchType,
      search,
      results,
      receivedAt: Date.now(),
    })
  }

export const UPDATE_SEARCH_INPUT = 'UPDATE_SEARCH_INPUT'
export const updateSearchInput =
  (search: string) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: UPDATE_SEARCH_INPUT,
      search,
      receivedAt: Date.now(),
    })
  }

export const SEARCH_INPUT_ENTERED_ERROR = 'SEARCH_INPUT_ENTERED_ERROR'
export const searchInputEnteredError =
  (errorMessage: string) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: SEARCH_INPUT_ENTERED_ERROR,
      errorMessage,
      receivedAt: Date.now(),
    })
  }

export const CLEAR_SEARCH_INPUT_STATE = 'CLEAR_SEARCH_INPUT'
export const clearSearchInputState =
  () =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: CLEAR_SEARCH_INPUT_STATE,
    })
  }

export const CLEAR_SEARCH_INPUT_ENTERED_ERROR =
  'CLEAR_SEARCH_INPUT_ENTERED_ERROR'
export const clearSearchInputError =
  () =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: CLEAR_SEARCH_INPUT_ENTERED_ERROR,
    })
  }

export function handleSearchInput(rawSearch: string) {
  return async (
    dispatch: ThunkDispatch<State, void, Action>,
  ): Promise<void> => {
    const search = rawSearch.replace(',', '').trim()
    dispatch(searchInputEntered(search))
    try {
      const { searchResults, searchType } = await executeSearch(search)

      if (searchResults.length > 0) {
        dispatch(searchInputEnteredSuccess(search, searchType, searchResults))
        return dispatch(clearSearchInputState())
      }
      return dispatch(searchInputEnteredError('No results found.'))
    } catch (e: any) {
      dispatch(searchInputEnteredError(e.message))
    }
  }
}

// TODO: refactor for performance optimization - we should
// dispatch the appropriate success action with the appropriate JSON payload
export async function executeSearch(
  search: string,
): Promise<{ searchResults: object[]; searchType: string }> {
  //define the search scope
  interface SearchOptions {
    protocol: string
    network: string
    ctx: any
    method: string
  }

  const options: SearchOptions[] = [
    { protocol: 'neo3', network: 'testnet', ctx: NeoRest, method: 'block' },
    { protocol: 'neo3', network: 'testnet', ctx: NeoRest, method: 'balance' },
    { protocol: 'neo3', network: 'testnet', ctx: NeoRest, method: 'contract' },
    {
      protocol: 'neo3',
      network: 'testnet',
      ctx: NeoRest,
      method: 'transaction',
    },
    { protocol: 'neo3', network: 'mainnet', ctx: NeoRest, method: 'block' },
    {
      protocol: 'neo3',
      network: 'mainnet',
      ctx: NeoRest,
      method: 'balance',
    },
    {
      protocol: 'neo3',
      network: 'mainnet',
      ctx: NeoRest,
      method: 'contract',
    },
    {
      protocol: 'neo3',
      network: 'mainnet',
      ctx: NeoRest,
      method: 'transaction',
    },
  ]

  //execute the search across the search scope
  let searchResults: any[] = await Promise.all(
    options.map(async ({ network, protocol, ctx, method }) => {
      try {
        let res = await ctx[method].call(ctx, search, network)
        if (res && res.length !== 0) {
          //consider removing the length check since and address may have 0 balance
          if (method === 'balance') {
            res = {
              address: search,
              balances: res,
            }
          }
          res = { ...res, network: network, protocol: protocol, type: method }

          return res
        }
        return undefined
      } catch (e) {
        return undefined
      }
    }),
  )
  searchResults = searchResults.filter(res => res !== undefined)
  return { searchResults, searchType: searchResults.length.toString() }
}
