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
  tokenId?: string
  contract: {
    chain?: string
    hash?: string
    symbol?: string
  }
  creator: {
    address?: string
    offchainName?: string
  }
  apiUrl?: string
  ownerships: {
    owner: {
      address?: string
    }
  }[]
  collection: {
    name?: string
    logoUrl?: string
  }
}

interface GhostMarketAssets {
  assets: GhostMarketNFT[]
  total: number
}

type GhostMarketAttribute = {
  trait_type: string
  value: string
}

type GhostMarketMetadata = {
  name?: string
  description?: string
  image?: string
  attributes?: GhostMarketAttribute[]
}

export const nftLimit = 8

export function treatNFTImage(srcImage: string) {
  if (srcImage.startsWith('ipfs://')) {
    const [, imageId] = srcImage.split('://')

    return `https://ghostmarket.mypinata.cloud/ipfs/${imageId}`
  }

  return srcImage
}

function mapAttributes(attributes: GhostMarketAttribute[]): NFTAttribute[] {
  return attributes.map(({ value, trait_type }): NFTAttribute => {
    return {
      key: trait_type,
      value,
    }
  })
}

async function getGhostMarketNFT(
  network: string,
  params: Record<string, any | any[]>,
) {
  const response = await fetch(
    BUILD_GHOST_MARKET_URL({
      path: 'assets',
      network,
      params,
    }),
  )

  const data = await response.json()

  const { assets, total } = data as GhostMarketAssets

  const nfts = assets.map(
    (
      nft,
    ): Omit<DETAILED_NFT, 'attributes' | 'image' | 'description' | 'name'> => {
      return {
        chain: nft.contract.chain || '',
        symbol: nft.contract.symbol || '',
        contract: nft.contract.hash || '',
        id: nft.tokenId || '',
        creatorName: nft.creator.offchainName || '',
        creatorAddress: nft.creator.address || '',
        ownerAddress: nft.ownerships[0].owner.address || '',
        apiUrl: nft.apiUrl || '',
        collection: {
          image: nft.collection.logoUrl || '',
          name: nft.collection.name || '',
        },
      }
    },
  )

  const nftsWithMetadataPromises = nfts.map(
    async (nft): Promise<DETAILED_NFT> => {
      const response = await fetch(
        BUILD_GHOST_MARKET_URL({
          path: 'metadata',
          network,
          params: {
            contract: nft.contract,
            tokenId: nft.id,
          },
        }),
      )

      const metadata = (await response.json()) as GhostMarketMetadata
      const attributes = metadata.attributes
        ? mapAttributes(metadata.attributes)
        : []

      return {
        ...nft,
        name: metadata.name || '',
        description: metadata.description || '',
        image: treatNFTImage(metadata.image || ''),
        attributes,
      }
    },
  )

  const nftsWithMetadata = await Promise.all(nftsWithMetadataPromises)

  return {
    nfts: nftsWithMetadata,
    total,
  }
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

export function fetchNFTS(ownerId: string, network: string, page = 1) {
  return async (
    dispatch: ThunkDispatch<State, void, Action>,
  ): Promise<void> => {
    dispatch(requestNFTS(page))
    try {
      const { nfts, total } = await getGhostMarketNFT(network, {
        owners: [ownerId],
        size: nftLimit,
        page,
        getTotal: true,
      })

      dispatch(requestNFTSSuccess(nfts, page, total))
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
      const {
        nfts: [nft],
      } = await getGhostMarketNFT(network, {
        tokenIds: [tokenId],
        contract: contractHash,
      })

      dispatch(requestNFTSuccess(nft))
    } catch (e) {
      dispatch(requestNFTError(e as Error))
    }
  }
}
