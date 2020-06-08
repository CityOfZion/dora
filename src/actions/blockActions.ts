import { Dispatch, Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { GENERATE_BASE_URL } from '../constants'
import { Block, State } from '../reducers/blockReducer'

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

export const REQUEST_BLOCKS = 'REQUEST_BLOCKS'
export const requestBlocks = (page: number) => (dispatch: Dispatch): void => {
  dispatch({
    type: REQUEST_BLOCKS,
    page,
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

export const REQUEST_BLOCKS_SUCCESS = 'REQUEST_BLOCKS_SUCCESS'
export const requestBlocksSuccess = (page: number, json: {}) => (
  dispatch: Dispatch,
): void => {
  dispatch({
    type: REQUEST_BLOCKS_SUCCESS,
    page,
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

export const REQUEST_BLOCKS_ERROR = 'REQUEST_BLOCKS_ERROR'
export const requestBlocksError = (page: number, error: Error) => (
  dispatch: Dispatch,
): void => {
  dispatch({
    type: REQUEST_BLOCKS_ERROR,
    page,
    error,
    receivedAt: Date.now(),
  })
}

export const CLEAR_BLOCKS_LIST = 'CLEAR_BLOCKS_LIST'
export const clearList = () => (dispatch: Dispatch): void => {
  dispatch({
    type: CLEAR_BLOCKS_LIST,
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

export function fetchBlocks(page = 1) {
  return async (
    dispatch: ThunkDispatch<State, void, Action>,
    getState: () => { block: State },
  ): Promise<void> => {
    try {
      dispatch(requestBlocks(page))
      const response = await fetch(`${GENERATE_BASE_URL()}/get_blocks/${page}`)
      const json = await response.json()
      dispatch(requestBlocksSuccess(page, json))
    } catch (e) {
      dispatch(requestBlockError(page, e))
    }
  }
}
