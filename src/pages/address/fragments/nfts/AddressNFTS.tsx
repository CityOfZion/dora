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
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import AddressHeader from '../AddressHeader'
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
    dispatch(fetchNFTS(hash, nextPage))
    setPage(lastState => lastState + 1)
  }

  function handleNavigate(id: string) {
    history.push(`${ROUTES.NFT.url}/${chain}/${network}/${hash}/${id}`)
  }

  useEffect(() => {
    if (windowWidth < 769) {
      setToggleTypeSelected('list')
    }
  }, [windowWidth])

  useEffect(() => {
    dispatch(fetchNFTS(hash))

    return () => {
      dispatch(clearList())
    }
  }, [dispatch])

  return (
    <div id="nft-container" className="page-container">
      <div className="inner-page-container">
        <AddressHeader {...props} />

        <NFTFilters
          toggleTypeSelected={toggleTypeSelected}
          onSelected={type => setToggleTypeSelected(type)}
        />

        {nftState.all.length > 0 ? (
          <>
            {toggleTypeSelected === 'list' ? (
              <NFTList data={nftState.all} onClickToNavigate={handleNavigate} />
            ) : (
              <NFTGallery
                data={nftState.all}
                onClickToNavigate={handleNavigate}
              />
            )}
          </>
        ) : (
          <div id="no-nft" className="horiz justify-center">
            <p>No NFT to list</p>
          </div>
        )}
        {nftState.isLoading && (
          <div style={{ marginTop: nftState.all.length > 0 ? '16px' : '0px' }}>
            <SkeletonTheme
              color="#21383d"
              highlightColor="rgb(125 159 177 / 25%)"
            >
              <Skeleton height={110} count={6} className="skeleton-row" />
            </SkeletonTheme>
          </div>
        )}

        <div className="button-container horiz justify-center">
          {nftState.total !== 0 && (
            <Button
              disabled={
                nftState.isLoading
                  ? true
                  : !!nftState.total
                  ? page * nftLimit >= nftState.total
                  : false
              }
              primary={false}
              onClick={(): void => loadMore()}
            >
              load more
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default withRouter(AddressNFTS)
