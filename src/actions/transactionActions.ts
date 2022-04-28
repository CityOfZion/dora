import { Dispatch, Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { GENERATE_BASE_URL, SUPPORTED_PLATFORMS } from '../constants'
import { State as NetworkState } from '../reducers/networkReducer'
import { State, Transaction } from '../reducers/transactionReducer'
import { sortSingleListByDate } from '../utils/time'
import { NeoLegacyREST, NeoRest } from '@cityofzion/dora-ts/dist/api'
import { TransactionsResponse as NLTransactionsResponse } from '@cityofzion/dora-ts/dist/interfaces/api/neo_legacy'
import { TransactionsResponse } from '@cityofzion/dora-ts/dist/interfaces/api/neo'

export const REQUEST_TRANSACTION = 'REQUEST_TRANSACTION'
export const requestTransaction =
  (hash: string) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: REQUEST_TRANSACTION,
      hash,
    })
  }

export const REQUEST_TRANSACTIONS = 'REQUEST_TRANSACTIONS'
export const requestTransactions =
  (page: number) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: REQUEST_TRANSACTIONS,
      page,
    })
  }

export const REQUEST_TRANSACTION_SUCCESS = 'REQUEST_TRANSACTION_SUCCESS'
export const requestTransactionSuccess =
  (hash: string, json: {}) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: REQUEST_TRANSACTION_SUCCESS,
      hash,
      json,
      receivedAt: Date.now(),
    })
  }

export const REQUEST_TRANSACTIONS_SUCCESS = 'REQUEST_TRANSACTIONS_SUCCESS'
export const requestTransactionsSuccess =
  (
    page: number,
    json: {
      all: { items: Array<Transaction> }
    },
  ) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: REQUEST_TRANSACTIONS_SUCCESS,
      page,
      json,
      receivedAt: Date.now(),
    })
  }

export const REQUEST_TRANSACTION_ERROR = 'REQUEST_TRANSACTION_ERROR'
export const requestTransactionError =
  (hash: string, error: Error) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: REQUEST_TRANSACTION_ERROR,
      hash,
      error,
      receivedAt: Date.now(),
    })
  }

export const REQUEST_TRANSACTIONS_ERROR = 'REQUEST_TRANSACTIONS_ERROR'
export const requestTransactionsError =
  (page: number, error: Error) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: REQUEST_TRANSACTIONS_ERROR,
      page,
      error,
      receivedAt: Date.now(),
    })
  }

export const CLEAR_TRANSACTIONS_LIST = 'CLEAR_TRANSACTIONS_LIST'
export const clearList =
  () =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: CLEAR_TRANSACTIONS_LIST,
      receivedAt: Date.now(),
    })
  }

export function shouldFetchTransaction(
  state: { transaction: State },
  hash: string,
): boolean {
  const tx = state.transaction.cached[hash]
  if (!tx) {
    return true
  }
  return false
}

export const RESET = 'RESET'

export function fetchTransaction(hash: string, chain: string) {
  return async (
    dispatch: ThunkDispatch<State, void, Action>,
    getState: () => { transaction: State; network: NetworkState },
  ): Promise<void> => {
    if (shouldFetchTransaction(getState(), hash)) {
      dispatch(requestTransaction(hash))

      const transactionRequestPromises = [
        fetch(`${GENERATE_BASE_URL()}/transaction/${hash}`),
        fetch(`${GENERATE_BASE_URL()}/log/${hash}`),
      ]

      chain === 'neo2' &&
        transactionRequestPromises.push(
          fetch(`${GENERATE_BASE_URL()}/transaction_abstracts/${hash}`),
        )

      try {
        const responses = await Promise.all(transactionRequestPromises)
        const mergedResponse = {}
        for (const response of responses) {
          const json =
            (await response.json().catch(e => {
              console.error({ e })
            })) || {}
          Object.assign(mergedResponse, json)
        }
        dispatch(requestTransactionSuccess(hash, mergedResponse))
      } catch (e) {
        dispatch(requestTransactionError(hash, e))
      }
    } else {
      return dispatch(
        requestTransactionSuccess(hash, getState().transaction.cached[hash]),
      )
    }
  }
}

export function fetchTransactions(page = 1) {
  return async (
    dispatch: ThunkDispatch<State, void, Action>,
    getState: () => { transaction: State },
  ): Promise<void> => {
    try {
      dispatch(requestTransactions(page))

      interface TransactionsResponseShunt extends NLTransactionsResponse {
        items: any[]
      }
      let res = await Promise.all(
        SUPPORTED_PLATFORMS.map(async ({ network, protocol }) => {
          let result:
            | TransactionsResponseShunt
            | TransactionsResponse
            | undefined = undefined
          if (protocol === 'neo3') {
            result = await NeoRest.transactions(page, network)
          } else if (protocol === 'neo2') {
            const oldResult = await NeoLegacyREST.transactions(page, network)
            result = oldResult as TransactionsResponseShunt
            result.items = oldResult.transactions
          }

          if (result) {
            result.items = result.items.map(d => ({
              ...d,
              network: network,
              protocol: protocol,
            }))
          }
          return result
        }),
      )

      res = res.flat().filter(r => r !== undefined)
      const all = {
        items: sortSingleListByDate(
          res
            .map(r => {
              return r!.items
            })
            .flat(),
        ) as Transaction[],
      }
      dispatch(requestTransactionsSuccess(page, { all }))
    } catch (e) {
      dispatch(requestTransactionsError(page, e))
    }
  }
}
