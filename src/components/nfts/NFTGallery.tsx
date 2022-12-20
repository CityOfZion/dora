import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { nftLimit } from '../../actions/nftActions'
import { NFT } from '../../reducers/nftReducer'
import NFTCardGallery from './NFTCardGallery'

import './NFTGallery.scss'

interface Props {
  data: NFT[]
  onClickToNavigate(id: string, contractHash: string): void
  isLoading: boolean
}

const NFTGallery: React.FC<Props> = ({
  data,
  isLoading,
  onClickToNavigate,
}) => {
  const skeletonRows = Array.from({ length: nftLimit }).map(
    (_item, index) => index,
  )

  return (
    <div id="nft-list-container">
      {data.map(item => (
        <NFTCardGallery
          key={item.id}
          data={item}
          onClickToNavigate={() => onClickToNavigate(item.id, item.contract)}
        />
      ))}

      {isLoading &&
        skeletonRows.map(item => (
          <SkeletonTheme
            key={item}
            color="#21383d"
            highlightColor="rgb(125 159 177 / 25%)"
          >
            <Skeleton height={399} width={280} />
          </SkeletonTheme>
        ))}
    </div>
  )
}

export default NFTGallery
