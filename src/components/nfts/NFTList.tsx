import React from 'react'
import { NFT } from '../../reducers/nftReducer'
import NFTCard from './NFTCardList'

import './NFTList.scss'

interface Props {
  data: NFT[]
  onClickToNavigate(id: string): void
}

const NFTList: React.FC<Props> = ({ data, onClickToNavigate }) => {
  return (
    <div id="nft-cards-list-container" className="verti">
      {data.map(item => (
        <NFTCard
          key={item.id}
          data={item}
          onClickToNavigate={() => onClickToNavigate(item.id)}
        />
      ))}
    </div>
  )
}

export default NFTList
