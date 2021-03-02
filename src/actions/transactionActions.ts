import { Dispatch, Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { GENERATE_BASE_URL } from '../constants'
import { State as NetworkState } from '../reducers/networkReducer'
import { State, Transaction } from '../reducers/transactionReducer'
import { sortedByDate } from '../utils/time'

export const REQUEST_TRANSACTION = 'REQUEST_TRANSACTION'
export const requestTransaction = (hash: string) => (
  dispatch: Dispatch,
): void => {
  dispatch({
    type: REQUEST_TRANSACTION,
    hash,
  })
}

export const REQUEST_TRANSACTIONS = 'REQUEST_TRANSACTIONS'
export const requestTransactions = (page: number) => (
  dispatch: Dispatch,
): void => {
  dispatch({
    type: REQUEST_TRANSACTIONS,
    page,
  })
}

export const REQUEST_TRANSACTION_SUCCESS = 'REQUEST_TRANSACTION_SUCCESS'
export const requestTransactionSuccess = (hash: string, json: {}) => (
  dispatch: Dispatch,
): void => {
  dispatch({
    type: REQUEST_TRANSACTION_SUCCESS,
    hash,
    json,
    receivedAt: Date.now(),
  })
}

export const REQUEST_TRANSACTIONS_SUCCESS = 'REQUEST_TRANSACTIONS_SUCCESS'
export const requestTransactionsSuccess = (
  page: number,
  json: {
    neo2: { transactions: Array<Transaction> }
    neo3: { transactions: Array<Transaction> }
    all: { transactions: Array<Transaction> }
  },
) => (dispatch: Dispatch): void => {
  dispatch({
    type: REQUEST_TRANSACTIONS_SUCCESS,
    page,
    json,
    receivedAt: Date.now(),
  })
}

export const REQUEST_TRANSACTION_ERROR = 'REQUEST_TRANSACTION_ERROR'
export const requestTransactionError = (hash: string, error: Error) => (
  dispatch: Dispatch,
): void => {
  dispatch({
    type: REQUEST_TRANSACTION_ERROR,
    hash,
    error,
    receivedAt: Date.now(),
  })
}

export const REQUEST_TRANSACTIONS_ERROR = 'REQUEST_TRANSACTIONS_ERROR'
export const requestTransactionsError = (page: number, error: Error) => (
  dispatch: Dispatch,
): void => {
  dispatch({
    type: REQUEST_TRANSACTIONS_ERROR,
    page,
    error,
    receivedAt: Date.now(),
  })
}

export const CLEAR_TRANSACTIONS_LIST = 'CLEAR_TRANSACTIONS_LIST'
export const clearList = () => (dispatch: Dispatch): void => {
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
export const resetTransactionState = () => (dispatch: Dispatch): void => {
  dispatch({
    type: RESET,
    receivedAt: Date.now(),
  })
}

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

      const neo2 = await (
        await fetch(`${GENERATE_BASE_URL('neo2', false)}/transactions/${page}`)
      ).json()

      const neo3 = await (
        await fetch(`${GENERATE_BASE_URL('neo3', false)}/transactions/${page}`)
      ).json()

      neo3.transactions = neo3.items

      const all = {
        transactions: sortedByDate(
          neo2.transactions,
          neo3.transactions,
        ) as Transaction[],
      }

      dispatch(requestTransactionsSuccess(page, { neo2, neo3, all }))
    } catch (e) {
      dispatch(requestTransactionsError(page, e))
    }
  }
}
