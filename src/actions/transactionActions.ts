import { Dispatch, Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { SUPPORTED_PLATFORMS } from '../constants'
import { State as NetworkState } from '../reducers/networkReducer'
import { State, Transaction } from '../reducers/transactionReducer'
import { sortSingleListByDate } from '../utils/time'
import { NeoRESTApi } from '@cityofzion/dora-ts/dist/api'

const NeoRest = new NeoRESTApi({
  doraUrl: 'https://dora.coz.io',
  endpoint: '/api/v2/neo3',
})

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
      totalCount: number
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
      const network = getState().network.network

      try {
        const requests: Promise<any>[] = [
          NeoRest.transaction(hash, network),
          NeoRest.log(hash, network),
        ]

        const responses = await Promise.all(requests)
        const mergedResponse = {}
        for (const response of responses) {
          Object.assign(mergedResponse, response)
        }
        dispatch(requestTransactionSuccess(hash, mergedResponse))
      } catch (e: any) {
        dispatch(requestTransactionError(hash, e))
      }
    } else {
      return dispatch(
        requestTransactionSuccess(hash, getState().transaction.cached[hash]),
      )
    }
  }
}

export function fetchTransactions(
  network?: string,
  protocol?: string,
  page = 1,
) {
  return async (
    dispatch: ThunkDispatch<State, void, Action>,
    getState: () => { transaction: State },
  ): Promise<void> => {
    try {
      dispatch(requestTransactions(page))
      let totalCount = 0
      const filterSupportedPlatform =
        network === 'all'
          ? SUPPORTED_PLATFORMS
          : SUPPORTED_PLATFORMS.filter(item => {
              return (
                (!protocol || item.protocol === protocol) &&
                (!network || item.network === network)
              )
            })

      const res = await Promise.all(
        filterSupportedPlatform.map(async ({ network, protocol }) => {
          const result = await NeoRest.transactions(page, network)
          totalCount += result.totalCount
          return result.items.map(
            ({ time, hash, size }) =>
              ({
                size,
                time: Number(time),
                txid: hash,
                protocol: protocol,
                network: network,
              } as Transaction),
          )
        }),
      )
      const flatRes = res.flat()
      const all = {
        items: sortSingleListByDate(flatRes) as Transaction[],
      }
      dispatch(requestTransactionsSuccess(page, { all, totalCount }))
    } catch (e: any) {
      dispatch(requestTransactionsError(page, e))
    }
  }
}
