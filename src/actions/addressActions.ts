import { Dispatch, Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { rpc } from '@cityofzion/neon-js'

import { State } from '../reducers/addressReducer'
import { State as NetworkState } from '../reducers/networkReducer'
import { NeoRest } from '../rest'
import { toError } from './utils'

export const REQUEST_ADDRESS = 'REQUEST_ADDRESS'
export const requestAddress =
  (requestedAddress: string) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: REQUEST_ADDRESS,
      requestedAddress,
    })
  }

export const REQUEST_ADDRESS_SUCCESS = 'REQUEST_ADDRESS_SUCCESS'
export const requestAddressSuccess =
  (requestedAddress: string, json: object) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: REQUEST_ADDRESS_SUCCESS,
      requestedAddress,
      json,
      receivedAt: Date.now(),
    })
  }

export const REQUEST_ADDRESS_ERROR = 'REQUEST_ADDRESS_ERROR'
export const requestAddressError =
  (requestedAddress: string, error: Error) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: REQUEST_ADDRESS_ERROR,
      requestedAddress,
      error,
      receivedAt: Date.now(),
    })
  }

export const REQUEST_ADDRESS_TRANSFER_HISTORY =
  'REQUEST_ADDRESS_TRANSFER_HISTORY'
export const requestAddressTransferHistory =
  (requestedAddress: string, transferHistoryPage = 1) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: REQUEST_ADDRESS_TRANSFER_HISTORY,
      requestedAddress,
      transferHistoryPage,
    })
  }

export const REQUEST_ADDRESS_TRANSFER_HISTORY_SUCCESS =
  'REQUEST_ADDRESS_TRANSFER_HISTORY_SUCCESS'
export const requestAddressTransferHistorySuccess =
  (requestedAddress: string, transferHistoryPage = 1, json: object) =>
  (dispatch: Dispatch): void => {
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
export const requestAddressTransferHistoryError =
  (requestedAddress: string, transferHistoryPage = 1, error: Error) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: REQUEST_ADDRESS_TRANSFER_HISTORY_ERROR,
      requestedAddress,
      transferHistoryPage,
      error,
      receivedAt: Date.now(),
    })
  }

export const RESET = 'RESET'
export const resetAddressState =
  () =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: RESET,
      receivedAt: Date.now(),
    })
  }

export const REQUEST_UNCLAIMED_GAS_SUCCESS = 'REQUEST_UNCLAIMED_GAS_SUCCESS'
export function fetchUnclaimedGas(address: string, network: string) {
  return async (
    dispatch: ThunkDispatch<object, void, Action>,
  ): Promise<void> => {
    dispatch(requestAddress(address))

    try {
      const client = new rpc.RPCClient(
        network === 'mainnet'
          ? import.meta.env.VITE_NODE_NEO3_MAINNET ||
              'https://mainnet1.neo.coz.io:443'
          : import.meta.env.VITE_NODE_NEO3_TESTNET ||
              'https://testnet1.neo.coz.io:443',
      )
      const unclaimedGas = await client.getUnclaimedGas(address)
      dispatch({
        type: REQUEST_UNCLAIMED_GAS_SUCCESS,
        unclaimedGas,
        receivedAt: Date.now(),
      })
    } catch (error) {
      dispatch(requestAddressError(address, toError(error)))
    }
  }
}

type ParsedBalanceData = {
  name: string
  balance: string | number
  symbol: string
  asset: string
}

export function fetchAddress(address: string, _chain: string) {
  return async (
    dispatch: ThunkDispatch<object, void, Action>,
    getState: () => { network: NetworkState },
  ): Promise<void> => {
    dispatch(requestAddress(address))
    try {
      const network = getState().network.network
      const response = await NeoRest.balance(address, network)

      // TODO: see if its possible for this data to be added
      // so that these requests are not necessary
      const fetchNeo3AssetData = async (): Promise<ParsedBalanceData[]> => {
        const balances: ParsedBalanceData[] = []

        for (const balanceData of response) {
          const symbol = balanceData.symbol
          const name = balanceData.asset_name
          const balance = String(balanceData.balance).replace(
            /(,)(?=(\d{3})+$)/g,
            '$1.',
          )

          balances.push({
            name,
            symbol,
            balance,
            asset: balanceData.asset,
          })
        }

        return balances
      }

      const balances = await fetchNeo3AssetData()

      dispatch(requestAddressSuccess(address, balances))
    } catch (e) {
      dispatch(requestAddressError(address, toError(e)))
    }
  }
}

export function fetchAddressTransferHistory(address: string, page = 1) {
  return async (
    dispatch: ThunkDispatch<object, void, Action>,
    _getState: () => State,
  ): Promise<void> => {
    dispatch(requestAddressTransferHistory(address, page))
    try {
      const network = 'neo2'
      const response = await NeoRest.transferHistory(address, page, network)
      dispatch(requestAddressTransferHistorySuccess(address, page, response))
    } catch (e) {
      dispatch(requestAddressTransferHistoryError(address, page, toError(e)))
    }
  }
}
