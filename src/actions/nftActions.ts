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
  tokenId: string
  contract: {
    chain?: string
    hash: string
    symbol: string
    contractId?: number
  }
  creator: {
    address?: string
    addressVerified?: boolean
    addressId: number
  }
  apiUrl?: string
  ownership: {
    owner: {
      address?: string
      addressVerified?: boolean
      offchainName?: string
      offchainTitle?: string
      addressId?: number
    }
    amount?: string
  }
  nftType: string[]
  collection: {
    name?: string
    logoUrl?: string
  }
  metadata: {
    description: string
    mediaType: string
    mediaUri: string
    mintDate: number
    mintNumber: number
    name: string
  }
}

interface GhostMarketAssets {
  assets: GhostMarketNFT[] | null
  next: string
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

export const nftLimit = 4

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

  const { assets, next } = data as GhostMarketAssets

  if (!assets) {
    throw new Error(`The property assets is null`)
  }

  const nfts = assets.map(
    (
      nft,
    ): Omit<DETAILED_NFT, 'attributes' | 'image' | 'description' | 'name'> => {
      return {
        chain: nft.contract.chain || '',
        symbol: nft.contract.symbol || '',
        contract: nft.contract.hash || '',
        id: nft.tokenId || '',
        creatorName: nft.ownership.owner.offchainName || '',
        creatorAddress: nft.creator.address || '',
        ownerAddress: nft.ownership.owner.address || '',
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
    next,
  }
}

export const requestNFTS =
  (next?: string) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: ActionType.REQUEST_NFTS,
      next,
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
      hasMore: true,
    })
  }

export const requestNFTError =
  (error: Error) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: ActionType.REQUEST_NFT_SUCCESS,
      error,
      hasMore: false,
    })
  }

export const requestNFTSSuccess =
  (data: NFT[], total: number, next?: string) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: ActionType.REQUEST_NFTS_SUCCESS,
      all: data,
      total,
      next,
      hasMore: true,
    })
  }

export const requestNFTSError =
  (error: Error, next?: string) =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: ActionType.REQUEST_NFTS_ERROR,
      error,
      next,
      hasMore: false,
    })
  }

export const clearList =
  () =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: ActionType.CLEAR_NFTS_LIST,
    })
  }

export function fetchNFTS(ownerId: string, network: string, cursor?: string) {
  return async (
    dispatch: ThunkDispatch<State, void, Action>,
  ): Promise<void> => {
    dispatch(requestNFTS(cursor))
    try {
      const { nfts, next } = await getGhostMarketNFT(network, {
        size: nftLimit,
        owners: [ownerId],
        cursor,
      })

      dispatch(requestNFTSSuccess(nfts, nfts.length, next))
    } catch (e) {
      console.log(e)
      dispatch(requestNFTSError(e as Error, cursor))
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
