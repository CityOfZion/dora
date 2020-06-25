import { Dispatch, Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { GENERATE_BASE_URL } from '../constants'
import { State, Transaction } from '../reducers/transactionReducer'

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
export const requestTransactions = (cursor: string) => (
  dispatch: Dispatch,
): void => {
  dispatch({
    type: REQUEST_TRANSACTIONS,
    cursor,
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
  cursor: string,
  json: { transactions: Array<Transaction> },
) => (dispatch: Dispatch): void => {
  dispatch({
    type: REQUEST_TRANSACTIONS_SUCCESS,
    cursor,
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
export const requestTransactionsError = (cursor: string, error: Error) => (
  dispatch: Dispatch,
): void => {
  dispatch({
    type: REQUEST_TRANSACTIONS_ERROR,
    cursor,
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

export function fetchTransaction(hash: string) {
  return async (
    dispatch: ThunkDispatch<State, void, Action>,
    getState: () => { transaction: State },
  ): Promise<void> => {
    if (shouldFetchTransaction(getState(), hash)) {
      dispatch(requestTransaction(hash))

      try {
        const responses = await Promise.all([
          fetch(`${GENERATE_BASE_URL()}/get_transaction/${hash}`),
          fetch(`${GENERATE_BASE_URL()}/get_log/${hash}`),
          fetch(`${GENERATE_BASE_URL()}/get_transaction_abstracts/${hash}`),
        ])
        const mergedResponse = {}
        for (const response of responses) {
          const json = await response.json()
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

export function fetchTransactions(cursor = '') {
  return async (
    dispatch: ThunkDispatch<State, void, Action>,
    getState: () => { transaction: State },
  ): Promise<void> => {
    try {
      if (getState().transaction.list.length && !cursor) {
        return
      }
      dispatch(requestTransactions(cursor))
      const response = await fetch(
        `${GENERATE_BASE_URL()}/get_transactions/${cursor}`,
      )
      const json = await response.json()
      const nextCursor = json.last_evaluated_key
      dispatch(requestTransactionsSuccess(nextCursor, json))
    } catch (e) {
      dispatch(requestTransactionsError(cursor, e))
    }
  }
}
