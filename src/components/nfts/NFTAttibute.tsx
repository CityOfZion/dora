import React from 'react'
import { NFTAttribute as NFTAttributesData } from '../../reducers/nftReducer'

import './NFTAttribute.scss'

type Props = {
  data: NFTAttributesData
}

const NFTAttribute: React.FC<Props> = ({ data }) => {
  return (
    <div className="nft-attribute horiz justify-center">
      {!!data.key ? (
        <span>{data.key}:</span>
      ) : (
        <span className="parameter-without-key">No key: </span>
      )}
      {!!data.value ? (
        <span className="parameter-value">{data.value}</span>
      ) : (
        <span className="parameter-without-value">No value</span>
      )}
    </div>
  )
}

export default NFTAttribute
