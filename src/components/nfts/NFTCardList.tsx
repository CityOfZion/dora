import React from 'react'
import { NFT } from '../../reducers/nftReducer'
import ArrowForward from '@material-ui/icons/ArrowForward'
import NFTAttribute from './NFTAttibute'

import NoImageFound from '../../assets/no-image-found.png'

import './NFTCardList.scss'
import TextBreakable from '../text-breakable/TextBreakable'

type Props = {
  data: NFT
  onClickToNavigate(): void
}

const NFTCardList: React.FC<Props> = ({ data, onClickToNavigate }) => {
  function handleOnError({
    currentTarget,
  }: React.SyntheticEvent<HTMLImageElement, Event>) {
    currentTarget.onerror = null
    currentTarget.src = NoImageFound
  }

  return (
    <button onClick={onClickToNavigate}>
      <div className="card-list-container">
        <div className="card-image-container">
          <div className="token-image">
            <img
              src={data.image}
              alt={data.name}
              onError={handleOnError}
              loading="lazy"
            />
          </div>
        </div>
        <div className="card-header">
          <div className="card-header-content">
            <div className="collection-image-container">
              <div className="collection-image">
                <img
                  alt={data.collection.name}
                  src={data.collection.image}
                  loading="lazy"
                />
              </div>

              <span className="collection-name-mobile">
                {data.collection.name}
              </span>
            </div>
            <div className="infos-container">
              <p className="token-name">{data.name}</p>
              <div className="secondary-infos">
                <p className="collection-name">{data.collection.name}</p>
                <div>
                  <span>ID</span>
                  <TextBreakable text={`#${data.id}`} className="token-id" />
                </div>
              </div>
            </div>
          </div>
          <div className="navigate-button">
            <ArrowForward />
          </div>
        </div>
        <div className="card-body">
          {data.attributes.length > 0 ? (
            data.attributes.map(attribute => (
              <NFTAttribute
                key={attribute.key || attribute.value}
                data={attribute}
              />
            ))
          ) : (
            <p className="no-attributes">No attributes</p>
          )}
        </div>
      </div>
    </button>
  )
}

export default NFTCardList
