import { Dispatch, Action } from 'redux'

import { GENERATE_BASE_URL } from '../constants'
import { Block, State } from '../reducers/blockReducer'
import { ThunkDispatch } from 'redux-thunk'

export const REQUEST_BLOCK = 'REQUEST_BLOCK'
// We can dispatch this action if requesting
// block by height (index) or by its hash
export const requestBlock = (indexOrHash: string | number) => (
  dispatch: Dispatch,
): void => {
  dispatch({
    type: REQUEST_BLOCK,
    indexOrHash,
  })
}

export const REQUEST_BLOCK_SUCCESS = 'REQUEST_BLOCK_SUCCESS'
export const requestBlockSuccess = (blockHeight: number, json: Block) => (
  dispatch: Dispatch,
): void => {
  dispatch({
    type: REQUEST_BLOCK_SUCCESS,
    blockHeight,
    json,
    receivedAt: Date.now(),
  })
}

export const REQUEST_BLOCK_ERROR = 'REQUEST_BLOCK_ERROR'
export const requestBlockError = (blockHeight: number, error: Error) => (
  dispatch: Dispatch,
): void => {
  dispatch({
    type: REQUEST_BLOCK_ERROR,
    blockHeight,
    error,
    receivedAt: Date.now(),
  })
}

export function shouldFetchBlock(
  state: { block: State },
  index: number,
): boolean {
  const block = state.block.cached[index]
  if (!block) {
    return true
  }
  return false
}

export function fetchBlock(indexOrHash = 1) {
  return async (
    dispatch: ThunkDispatch<State, void, Action>,
    getState: () => { block: State },
  ): Promise<void> => {
    if (shouldFetchBlock(getState(), indexOrHash)) {
      dispatch(requestBlock(indexOrHash))

      try {
        const response = await fetch(
          `${GENERATE_BASE_URL()}/get_block/${indexOrHash}`,
        )
        const json = await response.json()
        dispatch(requestBlockSuccess(indexOrHash, json))
      } catch (e) {
        dispatch(requestBlockError(indexOrHash, e))
      }
    }
  }
}
