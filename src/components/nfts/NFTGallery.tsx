import React from 'react'
import { NFT } from '../../reducers/nftReducer'
import NFTCardGallery from './NFTCardGallery'

import './NFTGallery.scss'

interface Props {
  data: NFT[]
  onClickToNavigate(id: string): void
}

const NFTGallery: React.FC<Props> = ({ data, onClickToNavigate }) => {
  return (
    <div id="nft-list-container">
      {data.map(item => (
        <NFTCardGallery
          key={item.id}
          data={item}
          onClickToNavigate={() => onClickToNavigate(item.id)}
        />
      ))}
    </div>
  )
}

export default NFTGallery
