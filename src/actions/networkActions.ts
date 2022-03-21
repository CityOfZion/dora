import { Dispatch } from 'redux'

export const CHANGE_NETWORK = 'CHANGE_NETWORK'
export const changeNetwork =
  (network: string) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: CHANGE_NETWORK,
      network,
    })
  }

export const CHANGE_CHAIN = 'CHANGE_CHAIN'
export const changeChain =
  (chain: string) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: CHANGE_CHAIN,
      chain,
    })
  }
