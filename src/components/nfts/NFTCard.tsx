import React from 'react'
import { NFT } from '../../reducers/nftReducer'
import { Link } from 'react-router-dom'
import ArrowForward from '@material-ui/icons/ArrowForward'
import NFTAttribute from './NFTAttibute'

import NoImageFound from '../../assets/no-image-found.png'

import './NFTCard.scss'
import TextBreakable from '../text-breakable/TextBreakable'
import { ROUTES } from '../../constants'

type Props = {
  data: NFT
  chain: string
  network: string
  contractHash: string
}

const NFTCard: React.FC<Props> = ({ data, chain, network, contractHash }) => {
  function handleOnError({
    currentTarget,
  }: React.SyntheticEvent<HTMLImageElement, Event>) {
    currentTarget.onerror = null
    currentTarget.src = NoImageFound
  }

  return (
    <div className="card-container">
      <div className="card-image-container">
        <div className="token-image">
          <img src={data.image} alt={data.name} onError={handleOnError} />
        </div>
      </div>
      <div className="card-header">
        <div className="card-header-content">
          <div className="collection-image-container">
            {/* 
            
           TODO: uncomment the code below when Ghostmarket fix their API, currently is not returning an image for the collection
            
            <div className="collection-image">
              <img alt={data.collection.name} src={data.collection.image} />
            </div> */}

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
        <Link
          to={`${ROUTES.NFT.url}/${chain}/${network}/${contractHash}/${data.id}`}
        >
          <button className="navigate-button">
            <ArrowForward />
          </button>
        </Link>
      </div>
      <div className="card-body">
        {data.attributes.length > 0 ? (
          data.attributes.map(attribute => <NFTAttribute data={attribute} />)
        ) : (
          <p className="no-attributes">No attributes</p>
        )}
      </div>
    </div>
  )
}

export default NFTCard
