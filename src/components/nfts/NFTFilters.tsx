import React from 'react'

import galleryIcon from '../../assets/icons/nft-gallery.svg'
import listIcon from '../../assets/icons/nft-list.svg'
import galleryIconSelected from '../../assets/icons/nft-gallery-selected.svg'
import listIconSelected from '../../assets/icons/nft-list-selected.svg'

import './NFTFilters.scss'

export type NFTFiltersToggleType = 'list' | 'gallery'

interface Props {
  onSelected(type: NFTFiltersToggleType): void
  toggleTypeSelected: NFTFiltersToggleType
}

const NFTFilters: React.FC<Props> = ({ onSelected, toggleTypeSelected }) => {
  function handleOnSelect(type: NFTFiltersToggleType) {
    onSelected(type)
  }

  return (
    <div id="nft-filters-container">
      <button onClick={() => handleOnSelect('gallery')}>
        <img
          src={
            toggleTypeSelected === 'gallery' ? galleryIconSelected : galleryIcon
          }
          alt={toggleTypeSelected}
        />
      </button>

      <button onClick={() => handleOnSelect('list')}>
        <img
          src={toggleTypeSelected === 'list' ? listIconSelected : listIcon}
          alt={toggleTypeSelected}
        />
      </button>
    </div>
  )
}

export default NFTFilters
