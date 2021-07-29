import { Dispatch, Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { GENERATE_BASE_URL } from '../constants'
import { Contract, State } from '../reducers/contractReducer'
import { sortedByDate, sortedByDateRemix } from '../utils/time'
import { NeoLegacyREST, NeoRest } from '@cityofzion/dora-ts/dist/api'

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

      const options = [
        {protocol: 'neo2', network: 'mainnet'},
        {protocol: 'neo2', network: 'testnet'},
        {protocol: 'neo3', network: 'testnet'},
        {protocol: 'neo3', network: 'testnet_rc4'},
      ]

      const res = await Promise.all(options.map((async ({ network, protocol }) => {
        let res
        if (protocol === 'neo2') {
          res = await NeoLegacyREST.contracts(page, network)
        } else if (protocol === 'neo3') {
          res = await NeoRest.contracts(page, network)
        }
        res.items = res.items.map(d => ({...d, network: network, protocol: protocol}))
        return res
      })))
      const all = {
        items: sortedByDateRemix(res.map(r => { return r.items}).flat()) as Contract[]
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
        const response = await fetch(
          `${GENERATE_BASE_URL('neo2', 'mainnet',false)}/invocation_stats`,
        )
        const json = await response.json()
        dispatch(requestContractsInvocationsSuccess(json))
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
