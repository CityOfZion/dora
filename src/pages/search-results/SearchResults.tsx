import React, { ReactElement, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'

import Breadcrumbs from '../../components/navigation/Breadcrumbs'
import { ROUTES } from '../../constants'
import './SearchResults.scss'

import { State as SearchState } from '../../reducers/searchReducer'
import { handleSearchInput } from '../../actions/searchActions'
import { ReactComponent as Neo2 } from '../../assets/icons/neo2.svg'
import { ReactComponent as Neo3 } from '../../assets/icons/neo3.svg'
import { formatDate } from '../../utils/time'

interface MatchParams {
  search: string
  protocol: string
  network: string
}

type Props = RouteComponentProps<MatchParams>

const PlatformElement = ({ protocol, network }: { protocol: string | void, network: string | void }): ReactElement => (
  <div className="search-result-chain-info">
      <div id="chain-icon">
        {protocol === 'neo2' ? <Neo2 /> : <Neo3 />}
      </div>
      <p>
        {protocol === 'neo2' ? 'Neo Legacy' : 'Neo N3'}
      </p>
      <p>
        <small>
        {(() => {
          if (protocol === 'neo2' && network === 'mainnet') {
            return ('Mainnet')
          } else if (protocol === 'neo2' && network === 'testnet') {
            return ('Testnet')
          } else if (protocol === 'neo3' && network === 'testnet') {
            return ('RC3 Testnet')
          } else if (protocol === 'neo3' && network === 'testnet_rc4') {
            return ('RC4 Testnet')
          }
        })()}
        </small>
      </p>
  </div>
  )


const SearchResults: React.FC<Props> = (props: Props) => {
  const searchState = useSelector(
    ({ search }: { search: SearchState }) => search,
  )
  const { search, network } = props.match.params
  const { results } = searchState
  const dispatch = useDispatch()

  useEffect(() => {
    if (!results) {
      dispatch(handleSearchInput(search))
    }
  }, [dispatch, search, network, results])

  return (
    <div id="SearchResults" className="page-container">
      <div className="inner-page-container">
        <Breadcrumbs
          crumbs={[
            {
              url: ROUTES.HOME.url,
              label: 'Home',
            },
            {
              url: '#',
              label: 'Search Results',
              active: true,
            },
          ]}
        />

        <div className="page-title-container search-results-title">
          {ROUTES.SEARCH.renderIcon()}
          <h1>Search Results</h1>
        </div>

        <div className="results-explanation">
          Showing results for <div className="results">"{search}"</div>
        </div>

        <div className="results">
          {results &&
            Object.values(results).map(result => {
              return (
                <Link
                  to={`${ROUTES.BLOCK.url}/${result.protocol}/${result.network}/${result.index}`}
                >
                  <div className="search-result-container">
                    <PlatformElement protocol={result.protocol} network={result.network}/>
                    <div className="search-results-details">
                      <div className="search-result-type">
                        {ROUTES.BLOCKS.renderIcon()} Block
                      </div>
                      <div className="search-result-info">
                        <div className="search-result-detail">
                          <label>Height</label>
                          {result.index}
                        </div>
                        <div className="search-result-detail">
                          <label>Size</label>
                          {result.size.toLocaleString()} Bytes
                        </div>
                        <div className="search-result-detail">
                          <label>Date</label>
                          {formatDate(result.time)}
                        </div>

                        <div className="search-result-detail">
                          <label>Transaction count</label>
                          {result.txCount}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
        </div>
      </div>
    </div>
  )
}

export default withRouter(SearchResults)
