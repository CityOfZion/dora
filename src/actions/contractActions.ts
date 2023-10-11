import { Dispatch, Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { SUPPORTED_PLATFORMS } from '../constants'
import { Contract, InvocationStat, State } from '../reducers/contractReducer'
import { sortSingleListByDate } from '../utils/time'
import { NeoRESTApi } from '@cityofzion/dora-ts/dist/api'
import { ContractResponse } from '@cityofzion/dora-ts/dist/interfaces/api/neo'
import { State as NetworkState } from '../reducers/networkReducer'

const NeoRest = new NeoRESTApi({
  doraUrl: 'https://dora.coz.io',
  endpoint: '/api/v2/neo3',
})

export const REQUEST_CONTRACT = 'REQUEST_CONTRACT'
export const requestContract =
  (hash: string) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: REQUEST_CONTRACT,
      hash,
    })
  }

export const REQUEST_CONTRACTS = 'REQUEST_CONTRACTS'
export const requestContracts =
  (page: number) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: REQUEST_CONTRACTS,
      page,
    })
  }

export const REQUEST_CONTRACT_SUCCESS = 'REQUEST_CONTRACT_SUCCESS'
export const requestContractSuccess =
  (hash: string, json: { contract: ContractResponse; stats: InvocationStat }) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: REQUEST_CONTRACT_SUCCESS,
      hash,
      json,
      receivedAt: Date.now(),
    })
  }

export const REQUEST_CONTRACTS_SUCCESS = 'REQUEST_CONTRACTS_SUCCESS'
export const requestContractsSuccess =
  (page: number, json: {}) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: REQUEST_CONTRACTS_SUCCESS,
      page,
      json,
      receivedAt: Date.now(),
    })
  }

export const REQUEST_CONTRACT_ERROR = 'REQUEST_CONTRACT_ERROR'
export const requestContractError =
  (hash: string, error: Error) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: REQUEST_CONTRACT_ERROR,
      hash,
      error,
      receivedAt: Date.now(),
    })
  }

export const REQUEST_CONTRACTS_ERROR = 'REQUEST_CONTRACTS_ERROR'
export const requestContractsError =
  (page: number, error: Error) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: REQUEST_CONTRACTS_ERROR,
      page,
      error,
      receivedAt: Date.now(),
    })
  }

export const CLEAR_CONTRACTS_LIST = 'CLEAR_CONTRACTS_LIST'
export const clearList =
  () =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: CLEAR_CONTRACTS_LIST,
      receivedAt: Date.now(),
    })
  }

export const REQUEST_CONTRACTS_INVOCATIONS = 'REQUEST_CONTRACTS_INVOCATIONS'
export const requestContractsInvocations =
  () =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: REQUEST_CONTRACTS_INVOCATIONS,
      receivedAt: Date.now(),
    })
  }

export const REQUEST_CONTRACTS_INVOCATIONS_SUCCESS =
  'REQUEST_CONTRACTS_INVOCATIONS_SUCCESS'
export const requestContractsInvocationsSuccess =
  (json: {}) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: REQUEST_CONTRACTS_INVOCATIONS_SUCCESS,
      json,
      receivedAt: Date.now(),
    })
  }

export const REQUEST_CONTRACTS_INVOCATIONS_ERROR =
  'REQUEST_CONTRACTS_INVOCATIONS_ERROR'
export const requestContractsInvocationsError =
  (error: Error) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: REQUEST_CONTRACTS_INVOCATIONS_ERROR,
      error,
      receivedAt: Date.now(),
    })
  }

export function shouldFetchContract(
  state: { contract: State },
  hash: string,
): boolean {
  const contract = state.contract.cached[hash]
  if (!contract) {
    return true
  }
  return false
}

export function shouldFetchContractsInvocations(state: {
  contract: State
}): boolean {
  if (!state.contract.hasFetchedContractsInvocations) {
    return true
  }
  return false
}

export const RESET = 'RESET'
export const resetContractState =
  () =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: RESET,
      receivedAt: Date.now(),
    })
  }

export function fetchContract(hash: string) {
  return async (
    dispatch: ThunkDispatch<State, void, Action>,
    getState: () => { contract: State; network: NetworkState },
  ): Promise<void> => {
    if (shouldFetchContract(getState(), hash)) {
      dispatch(requestContract(hash))

      try {
        const { network } = getState().network
        const contract = await NeoRest.contract(hash, network)
        const stats = await NeoRest.contractStats(hash, network)

        dispatch(
          requestContractSuccess(hash, {
            contract,
            stats: stats as InvocationStat,
          }),
        )
      } catch (e) {
        dispatch(requestContractError(hash, e))
      }
    }
  }
}

export function fetchContracts(network: string, protocol: string, page = 1) {
  return async (
    dispatch: ThunkDispatch<State, void, Action>,
  ): Promise<void> => {
    try {
      dispatch(requestContracts(page))
      let totalCount = 0
      const filterSupportedPlatform = SUPPORTED_PLATFORMS.filter(
        item =>
          network === 'all' ||
          (item.network === network && item.protocol === protocol),
      )
      const res = await Promise.all(
        filterSupportedPlatform.map(async ({ network, protocol }) => {
          const result = await NeoRest.contracts(page, network)
          if (result) {
            totalCount += result.totalCount
            return result.items.map(
              ({ asset_name, block, hash, time, type, symbol, manifest }) => ({
                block,
                time: parseInt(time),
                asset_name:
                  asset_name === '' && manifest?.name
                    ? manifest.name
                    : asset_name,
                hash: hash,
                type: type,
                symbol: symbol,
                network,
                protocol,
              }),
            )
          }
        }),
      )

      const cleanedContracts = res
        .flat()
        .filter(r => r !== undefined) as Contract[]

      const all = {
        items: sortSingleListByDate(cleanedContracts) as Contract[],
      }

      dispatch(requestContractsSuccess(page, { all, totalCount }))
    } catch (e: any) {
      dispatch(requestContractsError(page, e))
    }
  }
}

export function fetchContractsInvocations() {
  return async (
    dispatch: ThunkDispatch<State, void, Action>,
    getState: () => { contract: State },
  ): Promise<void> => {
    if (shouldFetchContractsInvocations(getState())) {
      dispatch(requestContractsInvocations())
      try {
        const res = await Promise.all(
          SUPPORTED_PLATFORMS.map(async ({ network, protocol }) => {
            const result = await NeoRest.invocationStats(network)
            if (result) {
              return result.map(d => ({
                ...d,
                network,
                protocol,
              }))
            }
          }),
        )
        const cleanedContracts = res.flat().filter(r => r !== undefined)
        const sortedContract = cleanedContracts
          .flat()
          .sort((a, b) => (a!.count < b!.count ? 1 : -1))
        dispatch(requestContractsInvocationsSuccess(sortedContract))
      } catch (e: any) {
        dispatch(requestContractsInvocationsError(e))
      }
    } else {
      dispatch(
        requestContractsInvocationsSuccess(
          getState().contract.contractsInvocations,
        ),
      )
    }
  }
}
