import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RouteComponentProps, useHistory, withRouter } from 'react-router-dom'
import { clearList, fetchNFTS, nftLimit } from '../../../../actions/nftActions'
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
  const [page, setPage] = useState(1)
  const [toggleTypeSelected, setToggleTypeSelected] =
    useState<NFTFiltersToggleType>('list')
  const nftState = useSelector<{ nft: State }, State>(({ nft }) => nft)
  const windowWidth = useWindowWidth()

  function loadMore(): void {
    const nextPage = page + 1
    dispatch(fetchNFTS(hash, network, nextPage))
    setPage(lastState => lastState + 1)
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
    dispatch(fetchNFTS(hash, network))

    return () => {
      dispatch(clearList())
    }
  }, [dispatch])

  return (
    <div id="nft-container" className="page-container">
      <NFTFilters
        toggleTypeSelected={toggleTypeSelected}
        onSelected={type => setToggleTypeSelected(type)}
      />

      {nftState.all.length > 0 ? (
        <>
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
        </>
      ) : (
        !nftState.isLoading && (
          <div id="no-nft" className="horiz justify-center">
            <p>No NFT to list</p>
          </div>
        )
      )}

      <div className="button-container horiz justify-center">
        {!!nftState.total && page * nftLimit < nftState.total && (
          <Button
            disabled={nftState.isLoading}
            primary={false}
            onClick={(): void => loadMore()}
          >
            load more
          </Button>
        )}
      </div>
    </div>
  )
}

export default withRouter(AddressNFTS)
