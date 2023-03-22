import { Dispatch, Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import {
  NEO_MAINNET_PLATFORMS,
  Platform,
  SUPPORTED_PLATFORMS,
} from '../constants'
import { Block, DetailedBlock, State } from '../reducers/blockReducer'
import { sortSingleListByDate } from '../utils/time'
import { NeoRest } from '@cityofzion/dora-ts/dist/api'
import { store } from '../store'
import { BlockTransaction } from '../reducers/transactionReducer'

export const REQUEST_BLOCK = 'REQUEST_BLOCK'
// We can dispatch this action if requesting
// block by height (index)
export const requestBlock =
  (index: number) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: REQUEST_BLOCK,
      index: index,
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
  (json: DetailedBlock) =>
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
  (index: number, error: Error) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: REQUEST_BLOCK_ERROR,
      index,
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
  index: number,
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

export function fetchBlock(index = 1) {
  return async (
    dispatch: ThunkDispatch<State, void, Action>,
    getState: () => { block: State },
  ): Promise<void> => {
    if (shouldFetchBlock(getState(), index)) {
      dispatch(requestBlock(index))
      try {
        const network = store.getState().network.network
        const response = await NeoRest.block(index, network)

        const block = {
          nextconsensus: response.nextconsensus,
          oversize: 0,
          previousblockhash: response.previousBlockHash,
          index: response.index,
          version: response.version,
          nonce: response.nonce,
          size: response.size,
          blocktime: response.blocktime,
          merkleroot: response.merkleroot,
          time: Number(response.time),
          hash: response.hash,
          jsonsize: response.jsonsize,
          tx: response.tx.map(
            t =>
              ({
                size: t.size,
                time: Number(t.time),
                txid: t.hash,
                hash: t.hash,
              } as BlockTransaction),
          ),
        } as DetailedBlock
        dispatch(requestBlockSuccess(block))
      } catch (e) {
        dispatch(requestBlockError(index, e))
      }
    }
  }
}

export function fetchBlocks(
  page = 1,
  chain?: string,
  supportedPlatforms: Platform[] = SUPPORTED_PLATFORMS,
) {
  return async (
    dispatch: ThunkDispatch<State, void, Action>,
    getState: () => { block: State },
  ): Promise<void> => {
    try {
      dispatch(requestBlocks(page))

      const res = await Promise.allSettled(
        supportedPlatforms.map(async ({ network, protocol }) => {
          const result = await NeoRest.blocks(page, network)
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
      const cleanedBlocks = res
        .filter(it => it.status === 'fulfilled' && it.value)
        .map(it => (it as PromiseFulfilledResult<Block[]>).value)
        .flat() as Block[]

      const all = {
        items: sortSingleListByDate(cleanedBlocks),
      }
      dispatch(requestBlocksSuccess(page, { all }))
    } catch (e) {
      dispatch(requestBlockError(page, e))
    }
  }
}

export function fetchMainNetBlocks(page = 1, chain?: string) {
  return fetchBlocks(page, chain, NEO_MAINNET_PLATFORMS)
}
