import { Dispatch, Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { GENERATE_BASE_URL, SUPPORTED_PLATFORMS } from '../constants'
import { Block, State } from '../reducers/blockReducer'
import { sortSingleListByDate } from '../utils/time'
import { NeoLegacyREST, NeoRest } from '@cityofzion/dora-ts/dist/api'
import { BlocksResponse } from '@cityofzion/dora-ts/dist/interfaces/api/neo'
import { BlocksResponse as NLBlocksResponse } from '@cityofzion/dora-ts/dist/interfaces/api/neo_legacy'

export const REQUEST_BLOCK = 'REQUEST_BLOCK'
// We can dispatch this action if requesting
// block by height (index) or by its hash
export const requestBlock =
  (indexOrHash: string | number) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: REQUEST_BLOCK,
      indexOrHash,
    })
  }

export const REQUEST_BLOCKS = 'REQUEST_BLOCKS'
export const requestBlocks =
  (page: number) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: REQUEST_BLOCKS,
      page,
    })
  }

export const REQUEST_BLOCK_SUCCESS = 'REQUEST_BLOCK_SUCCESS'
export const requestBlockSuccess =
  (json: Block) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: REQUEST_BLOCK_SUCCESS,
      json,
      receivedAt: Date.now(),
    })
  }

export const REQUEST_BLOCKS_SUCCESS = 'REQUEST_BLOCKS_SUCCESS'
export const requestBlocksSuccess =
  (page: number, json: {}) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: REQUEST_BLOCKS_SUCCESS,
      page,
      json,
      receivedAt: Date.now(),
    })
  }

export const REQUEST_BLOCK_ERROR = 'REQUEST_BLOCK_ERROR'
export const requestBlockError =
  (indexOrHash: string | number, error: Error) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: REQUEST_BLOCK_ERROR,
      indexOrHash,
      error,
      receivedAt: Date.now(),
    })
  }

export const REQUEST_BLOCKS_ERROR = 'REQUEST_BLOCKS_ERROR'
export const requestBlocksError =
  (page: number, error: Error) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: REQUEST_BLOCKS_ERROR,
      page,
      error,
      receivedAt: Date.now(),
    })
  }

export const CLEAR_BLOCKS_LIST = 'CLEAR_BLOCKS_LIST'
export const clearList =
  () =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: CLEAR_BLOCKS_LIST,
      receivedAt: Date.now(),
    })
  }

export function shouldFetchBlock(
  state: { block: State },
  indexOrHash: string | number,
): boolean {
  return true

  // TODO: fix multichain caching
  // const block = state.block.cached[indexOrHash]
  // if (!block) {
  //   return true
  // }
  // return false
}

export const RESET = 'RESET'
export const resetBlockState =
  () =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: RESET,
      receivedAt: Date.now(),
    })
  }

export function fetchBlock(indexOrHash: string | number = 1) {
  return async (
    dispatch: ThunkDispatch<State, void, Action>,
    getState: () => { block: State },
  ): Promise<void> => {
    if (shouldFetchBlock(getState(), indexOrHash)) {
      dispatch(requestBlock(indexOrHash))
      try {
        const response = await fetch(
          `${GENERATE_BASE_URL()}/block/${indexOrHash}`,
        )
        const json = await response.json()
        dispatch(requestBlockSuccess(json))
      } catch (e) {
        dispatch(requestBlockError(indexOrHash, e))
      }
    }
  }
}

export function fetchBlocks(page = 1, chain?: string) {
  return async (
    dispatch: ThunkDispatch<State, void, Action>,
    getState: () => { block: State },
  ): Promise<void> => {
    try {
      dispatch(requestBlocks(page))

      const res = await Promise.allSettled(
        SUPPORTED_PLATFORMS.map(async ({ network, protocol }) => {
          let result: BlocksResponse | NLBlocksResponse | undefined = undefined
          if (protocol === 'neo2') {
            result = await NeoLegacyREST.blocks(page, network)
          } else if (protocol === 'neo3') {
            result = await NeoRest.blocks(page, network)
          }
          if (result) {
            return result.items.map(d => {
              const parsed: Block = {
                blocktime: d.blocktime,
                hash: d.hash,
                index: d.index,
                size: d.size,
                network,
                protocol,
                time: parseInt(d.time),
                txCount: d.txCount,
              }
              return parsed
            })
          }
        }),
      )
      let cleanedResults = res.filter(r => r['status'] === 'fulfilled')
      // @ts-ignore
      cleanedResults = cleanedResults.map(r => r['value'])
      // @ts-ignore
      const cleanedBlocks = cleanedResults
        .flat()
        .filter(r => r !== undefined) as Block[]
      const all = {
        items: sortSingleListByDate(cleanedBlocks) as Block[],
      }
      dispatch(requestBlocksSuccess(page, { all }))
    } catch (e) {
      dispatch(requestBlockError(page, e))
    }
  }
}
