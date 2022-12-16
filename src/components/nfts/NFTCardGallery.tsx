import React from 'react'
import { NFT } from '../../reducers/nftReducer'

import NoImageFound from '../../assets/no-image-found.png'
import TextBreakable from '../text-breakable/TextBreakable'

import './NFTCardGallery.scss'

interface Props {
  data: NFT
  onClickToNavigate(): void
}

const NFTCardGallery: React.FC<Props> = ({ data, onClickToNavigate }) => {
  function handleOnError({
    currentTarget,
  }: React.SyntheticEvent<HTMLImageElement, Event>) {
    currentTarget.onerror = null
    currentTarget.src = NoImageFound
  }

  return (
    <div className="card-gallery-container" onClick={onClickToNavigate}>
      <header>
        <div className="collection-image-container card-image">
          <img
            src={data.collection.image}
            alt={data.name}
            onError={handleOnError}
            loading="lazy"
          />
        </div>
        <p className="collection-name">{data.collection.name}</p>
      </header>
      <main className="verti justify-center">
        <div className="token-image-container card-image">
          <img
            src={data.image}
            alt={data.name}
            onError={handleOnError}
            loading="lazy"
          />
        </div>

        <p className="token-name">{data.name}</p>
      </main>
      <footer>
        <div className="nft-id-container horiz justify-center">
          <span>ID:</span>
          <TextBreakable text={`#${data.id}`} className="token-id" />
        </div>
      </footer>
    </div>
  )
}

export default NFTCardGallery
