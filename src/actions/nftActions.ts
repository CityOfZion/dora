import { Action, Dispatch } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { BUILD_GHOST_MARKET_URL } from '../constants'
import {
  ActionType,
  DETAILED_NFT,
  NFT,
  NFTAttribute,
  State,
} from '../reducers/nftReducer'

interface GhostMarketNFT {
  nft: {
    token_id?: string
    chain?: string
    symbol?: string
    creator_address?: string
    creator_offchain_name?: string
    api_url?: string
    contract?: string
    owners: {
      address: string
    }[]
    collection: {
      name?: string
      featured_image?: string
    }
    nft_metadata: {
      name?: string
      image?: string
      description?: string
      attributes: GhostMarketAttributes[]
    }
  }
}

interface GhostMarketAssets {
  assets: GhostMarketNFT[]
  total_results: number
}

type GhostMarketAttributes = {
  name_id: string
  name: string
  display_name: string
  value_id: number
  value: string
  display_value: string
  count: number
  count_overall: number
  count_on_sale: number
  rarity: number
}

export const nftLimit = 8

export function treatNFTImage(srcImage: string) {
  if (srcImage.startsWith('ipfs://')) {
    const [, imageId] = srcImage.split('://')

    return `https://ghostmarket.mypinata.cloud/ipfs/${imageId}`
  }

  return srcImage
}

export const requestNFTS =
  (page: number) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: ActionType.REQUEST_NFTS,
      page,
    })
  }

export const requestNFT =
  () =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: ActionType.REQUEST_NFT,
    })
  }

export const requestNFTSuccess =
  (data: DETAILED_NFT) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: ActionType.REQUEST_NFT_SUCCESS,
      value: data,
    })
  }

export const requestNFTError =
  (error: Error) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: ActionType.REQUEST_NFT_SUCCESS,
      error,
    })
  }

export const requestNFTSSuccess =
  (data: NFT[], page: number, total: number) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: ActionType.REQUEST_NFTS_SUCCESS,
      all: data,
      page,
      total,
    })
  }

export const requestNFTSError =
  (error: Error, page: number) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: ActionType.REQUEST_NFTS_ERROR,
      error,
      page,
    })
  }

export const clearList =
  () =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: ActionType.CLEAR_NFTS_LIST,
    })
  }

function mapAttributes(attributes: GhostMarketAttributes[]): NFTAttribute[] {
  return attributes.map(({ value, name }): NFTAttribute => {
    return {
      key: name,
      value,
    }
  })
}

export function fetchNFTS(ownerId: string, network: string, page = 1) {
  return async (
    dispatch: ThunkDispatch<State, void, Action>,
  ): Promise<void> => {
    dispatch(requestNFTS(page))
    try {
      const response = await fetch(
        BUILD_GHOST_MARKET_URL({
          path: 'assets',
          network,
          params: {
            owner: ownerId,
            limit: nftLimit,
            offset: nftLimit * (page - 1),
            with_total: 1,
          },
        }),
      )
      const { assets, total_results } =
        (await response.json()) as GhostMarketAssets

      const nfts = assets
        ? assets.map(({ nft }): NFT => {
            const attributes = nft.nft_metadata.attributes
              ? mapAttributes(nft.nft_metadata.attributes)
              : []

            return {
              name: nft.nft_metadata.name || '',
              chain: nft.chain || '',
              image: treatNFTImage(nft.nft_metadata.image || ''),
              id: nft.token_id || '',
              contract: nft.contract || '',
              collection: {
                image: nft.collection.featured_image || '',
                name: nft.collection.name || '',
              },
              attributes,
            }
          })
        : []

      dispatch(requestNFTSSuccess(nfts, page, total_results))
    } catch (e) {
      console.log(e)
      dispatch(requestNFTSError(e as Error, page))
    }
  }
}

export function fetchNFT(
  tokenId: string,
  contractHash: string,
  network: string,
) {
  return async (
    dispatch: ThunkDispatch<State, void, Action>,
  ): Promise<void> => {
    dispatch(requestNFT())
    try {
      const response = await fetch(
        BUILD_GHOST_MARKET_URL({
          path: 'assets',
          network,
          params: {
            token_id: tokenId,
            contract: contractHash,
          },
        }),
      )
      const { assets } = (await response.json()) as GhostMarketAssets

      const [{ nft }] = assets

      const attributes = nft.nft_metadata.attributes
        ? mapAttributes(nft.nft_metadata.attributes)
        : []

      const mappedNFT = {
        name: nft.nft_metadata.name || '',
        chain: nft.chain || '',
        symbol: nft.symbol || '',
        contract: nft.contract || '',
        image: treatNFTImage(nft.nft_metadata.image || ''),
        id: nft.token_id || '',
        description: nft.nft_metadata.description || '',
        creatorName: nft.creator_offchain_name || '',
        creatorAddress: nft.creator_address || '',
        ownerAddress: nft.owners[0].address,
        apiUrl: nft.api_url || '',
        collection: {
          image: nft.collection.featured_image || '',
          name: nft.collection.name || '',
        },
        attributes,
      }

      dispatch(requestNFTSuccess(mappedNFT))
    } catch (e) {
      dispatch(requestNFTError(e as Error))
    }
  }
}
