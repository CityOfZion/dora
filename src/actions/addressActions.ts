import { Dispatch, Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { GENERATE_BASE_URL, NEO_HASHES, GAS_HASHES } from '../constants'
import { State } from '../reducers/addressReducer'
import { convertToArbitraryDecimals } from '../utils/formatter'

export const REQUEST_ADDRESS = 'REQUEST_ADDRESS'
export const requestAddress = (requestedAddress: string) => (
  dispatch: Dispatch,
): void => {
  dispatch({
    type: REQUEST_ADDRESS,
    requestedAddress,
  })
}

export const REQUEST_ADDRESS_SUCCESS = 'REQUEST_ADDRESS_SUCCESS'
export const requestAddressSuccess = (requestedAddress: string, json: {}) => (
  dispatch: Dispatch,
): void => {
  dispatch({
    type: REQUEST_ADDRESS_SUCCESS,
    requestedAddress,
    json,
    receivedAt: Date.now(),
  })
}

export const REQUEST_ADDRESS_ERROR = 'REQUEST_ADDRESS_ERROR'
export const requestAddressError = (requestedAddress: string, error: Error) => (
  dispatch: Dispatch,
): void => {
  dispatch({
    type: REQUEST_ADDRESS_ERROR,
    requestedAddress,
    error,
    receivedAt: Date.now(),
  })
}

export const REQUEST_ADDRESS_TRANSFER_HISTORY =
  'REQUEST_ADDRESS_TRANSFER_HISTORY'
export const requestAddressTransferHistory = (
  requestedAddress: string,
  transferHistoryPage = 1,
) => (dispatch: Dispatch): void => {
  dispatch({
    type: REQUEST_ADDRESS_TRANSFER_HISTORY,
    requestedAddress,
    transferHistoryPage,
  })
}

export const REQUEST_ADDRESS_TRANSFER_HISTORY_SUCCESS =
  'REQUEST_ADDRESS_TRANSFER_HISTORY_SUCCESS'
export const requestAddressTransferHistorySuccess = (
  requestedAddress: string,
  transferHistoryPage = 1,
  json: {},
) => (dispatch: Dispatch): void => {
  dispatch({
    type: REQUEST_ADDRESS_TRANSFER_HISTORY_SUCCESS,
    requestedAddress,
    transferHistoryPage,
    json,
    receivedAt: Date.now(),
  })
}

export const REQUEST_ADDRESS_TRANSFER_HISTORY_ERROR =
  'REQUEST_ADDRESS_TRANSFER_HISTORY_ERROR'
export const requestAddressTransferHistoryError = (
  requestedAddress: string,
  transferHistoryPage = 1,
  error: Error,
) => (dispatch: Dispatch): void => {
  dispatch({
    type: REQUEST_ADDRESS_TRANSFER_HISTORY_ERROR,
    requestedAddress,
    transferHistoryPage,
    error,
    receivedAt: Date.now(),
  })
}

export const RESET = 'RESET'
export const resetAddressState = () => (dispatch: Dispatch): void => {
  dispatch({
    type: RESET,
    receivedAt: Date.now(),
  })
}

type ParsedBalanceData = {
  name: string
  balance: string | number
  symbol: string
}

export function fetchAddress(address: string, chain: string) {
  return async (dispatch: ThunkDispatch<{}, void, Action>): Promise<void> => {
    dispatch(requestAddress(address))
    try {
      const response = await fetch(
        `${GENERATE_BASE_URL(chain)}/balance/${address}`,
      )
      const json = await response.json()

      // TODO: see if its possible for this data to be added
      // so that these requests are not necessary
      const fetchAssetData = async (): Promise<ParsedBalanceData[]> => {
        const balances: ParsedBalanceData[] = []

        for (const balanceData of json) {
          let symbol
          let name
          const balance = String(balanceData.balance).replace(
            /(,)(?=(\d{3})+$)/g,
            '$1.',
          )
          if (NEO_HASHES.includes(balanceData.asset)) {
            symbol = 'NEO'
          } else if (GAS_HASHES.includes(balanceData.asset)) {
            symbol = 'GAS'
          } else {
            const response = await fetch(
              `${GENERATE_BASE_URL(chain)}/asset/${balanceData.asset}`,
            )
            const json = await response.json()
            symbol = json.symbol
            name = json.name
          }

          balances.push({
            name,
            symbol,
            balance,
          })
        }

        return balances
      }

      console.log('fetching asset data')
      const balances = await fetchAssetData()

      dispatch(requestAddressSuccess(address, balances))
    } catch (e) {
      dispatch(requestAddressError(address, e))
    }
  }
}

export function fetchAddressTransferHistory(address: string, page = 1) {
  return async (
    dispatch: ThunkDispatch<{}, void, Action>,
    getState: () => State,
  ): Promise<void> => {
    dispatch(requestAddressTransferHistory(address, page))
    try {
      const response = await fetch(
        `${GENERATE_BASE_URL()}/transfer_history/${address}/${page}`,
      )
      const json = await response.json()
      dispatch(requestAddressTransferHistorySuccess(address, page, json))
    } catch (e) {
      dispatch(requestAddressTransferHistoryError(address, page, e))
    }
  }
}
