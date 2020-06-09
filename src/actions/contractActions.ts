import { Dispatch, Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { GENERATE_BASE_URL } from '../constants'
import { Contract, State } from '../reducers/contractReducer'

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

export function fetchContract(hash: string) {
  return async (
    dispatch: ThunkDispatch<State, void, Action>,
    getState: () => { contract: State },
  ): Promise<void> => {
    if (shouldFetchContract(getState(), hash)) {
      dispatch(requestContract(hash))

      try {
        const response = await fetch(
          `${GENERATE_BASE_URL()}/get_contract/${hash}`,
        )
        const json = await response.json()
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
    getState: () => { block: State },
  ): Promise<void> => {
    try {
      dispatch(requestContracts(page))
      const response = await fetch(
        `${GENERATE_BASE_URL()}/get_contracts/${page}`,
      )
      const json = await response.json()
      dispatch(requestContractsSuccess(page, json))
    } catch (e) {
      dispatch(requestContractsError(page, e))
    }
  }
}
