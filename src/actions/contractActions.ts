import { Dispatch, Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { GENERATE_BASE_URL, SUPPORTED_PLATFORMS } from '../constants'
import { Contract, State } from '../reducers/contractReducer'
import { sortSingleListByDate } from '../utils/time'
import { NeoLegacyREST, NeoRest } from '@cityofzion/dora-ts/dist/api'
import { ContractsResponse } from '@cityofzion/dora-ts/dist/interfaces/api/neo'
import {
  ContractsResponse as NLContractsResponse,
  InvocationStatsResponse,
} from '@cityofzion/dora-ts/dist/interfaces/api/neo_legacy'

export const REQUEST_CONTRACT = 'REQUEST_CONTRACT'
export const requestContract = (hash: string) => (dispatch: Dispatch): void => {
  dispatch({
    type: REQUEST_CONTRACT,
    hash,
  })
}

export const REQUEST_CONTRACTS = 'REQUEST_CONTRACTS'
export const requestContracts = (page: number) => (
  dispatch: Dispatch,
): void => {
  dispatch({
    type: REQUEST_CONTRACTS,
    page,
  })
}

export const REQUEST_CONTRACT_SUCCESS = 'REQUEST_CONTRACT_SUCCESS'
export const requestContractSuccess = (hash: string, json: Contract) => (
  dispatch: Dispatch,
): void => {
  dispatch({
    type: REQUEST_CONTRACT_SUCCESS,
    hash,
    json,
    receivedAt: Date.now(),
  })
}

export const REQUEST_CONTRACTS_SUCCESS = 'REQUEST_CONTRACTS_SUCCESS'
export const requestContractsSuccess = (page: number, json: {}) => (
  dispatch: Dispatch,
): void => {
  dispatch({
    type: REQUEST_CONTRACTS_SUCCESS,
    page,
    json,
    receivedAt: Date.now(),
  })
}

export const REQUEST_CONTRACT_ERROR = 'REQUEST_CONTRACT_ERROR'
export const requestContractError = (hash: string, error: Error) => (
  dispatch: Dispatch,
): void => {
  dispatch({
    type: REQUEST_CONTRACT_ERROR,
    hash,
    error,
    receivedAt: Date.now(),
  })
}

export const REQUEST_CONTRACTS_ERROR = 'REQUEST_CONTRACTS_ERROR'
export const requestContractsError = (page: number, error: Error) => (
  dispatch: Dispatch,
): void => {
  dispatch({
    type: REQUEST_CONTRACTS_ERROR,
    page,
    error,
    receivedAt: Date.now(),
  })
}

export const CLEAR_CONTRACTS_LIST = 'CLEAR_CONTRACTS_LIST'
export const clearList = () => (dispatch: Dispatch): void => {
  dispatch({
    type: CLEAR_CONTRACTS_LIST,
    receivedAt: Date.now(),
  })
}

export const REQUEST_CONTRACTS_INVOCATIONS = 'REQUEST_CONTRACTS_INVOCATIONS'
export const requestContractsInvocations = () => (dispatch: Dispatch): void => {
  dispatch({
    type: REQUEST_CONTRACTS_INVOCATIONS,
    receivedAt: Date.now(),
  })
}

export const REQUEST_CONTRACTS_INVOCATIONS_SUCCESS =
  'REQUEST_CONTRACTS_INVOCATIONS_SUCCESS'
export const requestContractsInvocationsSuccess = (json: {}) => (
  dispatch: Dispatch,
): void => {
  dispatch({
    type: REQUEST_CONTRACTS_INVOCATIONS_SUCCESS,
    json,
    receivedAt: Date.now(),
  })
}

export const REQUEST_CONTRACTS_INVOCATIONS_ERROR =
  'REQUEST_CONTRACTS_INVOCATIONS_ERROR'
export const requestContractsInvocationsError = (error: Error) => (
  dispatch: Dispatch,
): void => {
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
export const resetContractState = () => (dispatch: Dispatch): void => {
  dispatch({
    type: RESET,
    receivedAt: Date.now(),
  })
}

export function fetchContract(hash: string) {
  return async (
    dispatch: ThunkDispatch<State, void, Action>,
    getState: () => { contract: State },
  ): Promise<void> => {
    if (shouldFetchContract(getState(), hash)) {
      dispatch(requestContract(hash))

      try {
        const response = await fetch(`${GENERATE_BASE_URL()}/contract/${hash}`)

        const invocationStatsResponse = await fetch(
          `${GENERATE_BASE_URL()}/contract_stats/${hash}`,
        )

        const invocationStats = await invocationStatsResponse
          .json()
          .catch(e => {
            console.error('An error occurred fetching invocation stats.', { e })
          })

        const json = await response.json()
        json.invocationStats = invocationStats || null

        dispatch(requestContractSuccess(hash, json))
      } catch (e) {
        dispatch(requestContractError(hash, e))
      }
    }
  }
}

export function fetchContracts(page = 1) {
  return async (
    dispatch: ThunkDispatch<State, void, Action>,
  ): Promise<void> => {
    try {
      dispatch(requestContracts(page))

      const res = await Promise.all(
        SUPPORTED_PLATFORMS.map(async ({ network, protocol }) => {
          let result:
            | ContractsResponse
            | NLContractsResponse
            | undefined = undefined //TODO: Fix the typing
          if (protocol === 'neo2') {
            result = await NeoLegacyREST.contracts(page, network)
          } else if (protocol === 'neo3') {
            result = await NeoRest.contracts(page, network)
          }
          if (result) {
            return result.items.map(d => {
              if (d.asset_name === '' && 'manifest' in d && d.manifest.name) {
                d.asset_name = d.manifest.name
              } else if (d.asset_name === '' && 'name' in d) {
                d.asset_name = d.name
              }

              const parsed: Contract = {
                block: d.block,
                time: parseInt(d.time),
                asset_name: d.asset_name,
                hash: d.hash,
                type: d.type,
                symbol: d.symbol,
                network,
                protocol,
              }
              return parsed
            })
          }
        }),
      )

      const cleanedContracts = res
        .flat()
        .filter(r => r !== undefined) as Contract[]

      const all = {
        items: sortSingleListByDate(cleanedContracts) as Contract[],
      }

      dispatch(requestContractsSuccess(page, { all }))
    } catch (e) {
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
            let result: InvocationStatsResponse | undefined = undefined
            if (protocol === 'neo2') {
              result = await NeoLegacyREST.invocationStats(network)
            } else if (protocol === 'neo3') {
              result = await NeoRest.invocationStats(network)
            }
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
      } catch (e) {
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
