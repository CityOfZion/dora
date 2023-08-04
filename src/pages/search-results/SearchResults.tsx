/* eslint-disable */
import React, { ReactElement, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'

import Breadcrumbs from '../../components/navigation/Breadcrumbs'
import { ROUTES } from '../../constants'
import './SearchResults.scss'

import { State as SearchState } from '../../reducers/searchReducer'
import { handleSearchInput } from '../../actions/searchActions'
import { ReactComponent as Neo3 } from '../../assets/icons/neo3.svg'
import { formatDate } from '../../utils/time'
import { truncateHash } from '../../utils/formatter'
import useWindowWidth from '../../hooks/useWindowWidth'

interface MatchParams {
  search: string
  protocol: string
  network: string
}

type Props = RouteComponentProps<MatchParams>

const PlatformElement = ({
  protocol,
  network,
}: {
  protocol: string | void
  network: string | void
}): ReactElement => (
  <div className="search-result-chain-info">
    <div id="chain-icon">
      <Neo3 />
    </div>
    <p>Neo N3</p>
    <p>
      <small>
        {((): string => {
          if (network === 'mainnet') {
            return 'Mainnet'
          } else {
            return 'Testnet'
          }
        })()}
      </small>
    </p>
  </div>
)

const BlockResult = (result: any): ReactElement => (
  <Link
    to={`${ROUTES.BLOCK.url}/${result.protocol}/${result.network}/${result.index}`}
  >
    <div className="search-result-container">
      <PlatformElement protocol={result.protocol} network={result.network} />
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

const AddressResult = (result: any): ReactElement => {
  const width = useWindowWidth()
  return (
    <Link
      to={`${ROUTES.WALLET.url}/${result.protocol}/${result.network}/${result.address}`}
    >
      <div className="search-result-container">
        <PlatformElement protocol={result.protocol} network={result.network} />
        <div className="search-results-details">
          <div className="search-result-type">
            {ROUTES.WALLETS.renderIcon()} Address
          </div>
          <div className="search-result-info">
            <div className="search-result-detail">
              <label>Address</label>
              <span>
                {width <= 350
                  ? truncateHash(result.address, width <= 350, undefined, 5)
                  : truncateHash(result.address, width <= 576, undefined, 15)}
              </span>
            </div>
            <div className="search-result-detail">
              <label>Asset Types</label>
              <span>{result.balances.length}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

const TransactionResult = (result: any): ReactElement => (
  <Link
    to={`${ROUTES.TRANSACTION.url}/${result.protocol}/${result.network}/${result.hash}`}
  >
    <div className="search-result-container">
      <PlatformElement protocol={result.protocol} network={result.network} />
      <div className="search-results-details">
        <div className="search-result-type">
          {ROUTES.TRANSACTIONS.renderIcon()} Transaction
        </div>
        <div className="search-result-info"></div>
      </div>
    </div>
  </Link>
)

const ContractResult = (result: any): ReactElement => (
  <Link
    to={`${ROUTES.CONTRACT.url}/${result.protocol}/${result.network}/${result.hash}`}
  >
    <div className="search-result-container">
      <PlatformElement protocol={result.protocol} network={result.network} />
      <div className="search-results-details">
        <div className="search-result-type">
          {ROUTES.CONTRACTS.renderIcon()} Contract
        </div>
        <div className="search-result-info"></div>
      </div>
    </div>
  </Link>
)

const SearchResult = ({ result }: { result: any }): ReactElement => {
  switch (result.type) {
    case 'block':
      return BlockResult(result)
    case 'balance':
      return AddressResult(result)
    case 'transaction':
      return TransactionResult(result)
    case 'contract':
      return ContractResult(result)
  }
  return <div />
}

const SearchResults: React.FC<Props> = (props: Props) => {
  const searchState = useSelector(
    ({ search }: { search: SearchState }) => search,
  )
  const { search } = props.match.params
  const { results } = searchState
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(handleSearchInput(search))
  }, [dispatch, search])

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
              return <SearchResult result={result} />
            })}
        </div>
      </div>
    </div>
  )
}

export default withRouter(SearchResults)
