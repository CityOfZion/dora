import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RouteComponentProps, useHistory, withRouter } from 'react-router-dom'
import { clearList, fetchNFTS } from '../../../../actions/nftActions'
import NFTFilters, {
  NFTFiltersToggleType,
} from '../../../../components/nfts/NFTFilters'
import Button from '../../../../components/button/Button'
import { State } from '../../../../reducers/nftReducer'

import './AddressNFTS.scss'

import NFTList from '../../../../components/nfts/NFTList'
import NFTGallery from '../../../../components/nfts/NFTGallery'
import { ROUTES } from '../../../../constants'
import useWindowWidth from '../../../../hooks/useWindowWidth'

interface MatchParams {
  hash: string
  chain: string
  network: string
}

type Props = RouteComponentProps<MatchParams>

const AddressNFTS: React.FC<Props> = props => {
  const { hash, chain, network } = props.match.params

  const dispatch = useDispatch()
  const history = useHistory()
  const nftState = useSelector<{ nft: State }, State>(({ nft }) => nft)
  const windowWidth = useWindowWidth()

  const [toggleTypeSelected, setToggleTypeSelected] =
    useState<NFTFiltersToggleType>('list')

  function getNFTS() {
    const cursor = nftState.next ?? undefined
    dispatch(fetchNFTS(hash, network, cursor))
  }

  function handleNavigate(id: string, contractHash: string) {
    history.push(`${ROUTES.NFT.url}/${chain}/${network}/${contractHash}/${id}`)
  }

  useEffect(() => {
    if (windowWidth < 769) {
      setToggleTypeSelected('list')
    }
  }, [windowWidth])

  useEffect(() => {
    getNFTS()

    return () => {
      dispatch(clearList())
    }
  }, [dispatch])

  return (
    <div id="nft-container" className="page-container">
      {nftState.all.length > 0 && (
        <NFTFilters
          toggleTypeSelected={toggleTypeSelected}
          onSelected={type => setToggleTypeSelected(type)}
        />
      )}

      {toggleTypeSelected === 'list' ? (
        <NFTList
          isLoading={nftState.isLoading}
          data={nftState.all}
          onClickToNavigate={handleNavigate}
        />
      ) : (
        <NFTGallery
          isLoading={nftState.isLoading}
          data={nftState.all}
          onClickToNavigate={handleNavigate}
        />
      )}

      {!nftState.isLoading && nftState.all.length === 0 && (
        <div className="horiz justify-center no-nft">
          <p>No NFT to list</p>
        </div>
      )}

      <div className="button-container horiz justify-center">
        {nftState.hasMore && (
          <Button
            disabled={nftState.isLoading}
            primary={false}
            onClick={() => getNFTS()}
          >
            load more
          </Button>
        )}
      </div>
    </div>
  )
}

export default withRouter(AddressNFTS)
