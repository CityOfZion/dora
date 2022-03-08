import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { nftLimit } from '../../actions/nftActions'
import { NFT } from '../../reducers/nftReducer'
import NFTCard from './NFTCardList'

import './NFTList.scss'

interface Props {
  data: NFT[]
  isLoading: boolean
  onClickToNavigate(id: string, contractHash: string): void
}

const NFTList: React.FC<Props> = ({ data, isLoading, onClickToNavigate }) => {
  return (
    <div id="nft-cards-list-container" className="verti">
      {data.map(item => (
        <NFTCard
          key={item.id}
          data={item}
          onClickToNavigate={() => onClickToNavigate(item.id, item.contract)}
        />
      ))}

      {isLoading && (
        <SkeletonTheme color="#21383d" highlightColor="rgb(125 159 177 / 25%)">
          <Skeleton height={110} count={nftLimit} className="skeleton-row" />
        </SkeletonTheme>
      )}
    </div>
  )
}

export default NFTList
