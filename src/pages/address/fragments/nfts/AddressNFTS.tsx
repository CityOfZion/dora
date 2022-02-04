import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { clearList, fetchNFTS, nftLimit } from '../../../../actions/nftActions'
import NFTCard from '../../../../components/nfts/NFTCard'
import Button from '../../../../components/button/Button'
import { State } from '../../../../reducers/nftReducer'

import './AddressNFTS.scss'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import AddressHeader from '../AddressHeader'

interface MatchParams {
  hash: string
  chain: string
  network: string
}

type Props = RouteComponentProps<MatchParams>

const AddressNFTS: React.FC<Props> = props => {
  const { hash, chain, network } = props.match.params
  const dispatch = useDispatch()
  const [page, setPage] = useState(1)
  const nftState = useSelector<{ nft: State }, State>(({ nft }) => nft)

  function loadMore(): void {
    const nextPage = page + 1
    dispatch(fetchNFTS(hash, nextPage))
    setPage(lastState => lastState + 1)
  }

  useEffect(() => {
    dispatch(fetchNFTS(hash))

    return () => {
      dispatch(clearList())
    }
  }, [dispatch])

  return (
    <div id="nft-container">
      <AddressHeader {...props} />

      {!nftState.isLoading &&
        (nftState.all.length > 0 ? (
          <div id="nft-cards-container">
            {nftState.all.map(nft => (
              <NFTCard
                key={nft.id}
                data={nft}
                chain={chain}
                network={network}
                contractHash={nft.contract}
              />
            ))}
          </div>
        ) : (
          <div id="no-nft">
            <p>No NFT to list</p>
          </div>
        ))}
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

      <div id="button-container">
        {nftState.total === 0 && (
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
  )
}

export default withRouter(AddressNFTS)
