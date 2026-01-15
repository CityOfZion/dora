/* eslint-disable */
import React, { ReactElement, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom'

import Breadcrumbs from '../../components/navigation/Breadcrumbs'
import { ROUTES } from '../../constants'
import './SearchResults.scss'

import Neo3 from '../../assets/icons/neo3.svg?react'

import { formatDate } from '../../utils/time'
import { truncateHash } from '../../utils/formatter'
import useWindowWidth from '../../hooks/useWindowWidth'
import { AppThunkDispatch } from '../../store'
import {
  useBlockchainSearch,
  type SearchResult,
} from '../../hooks/useBlockchainSearch'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { NoResult } from '../../components/no-result/NoResult'

type PlatformElementProps = { network: string }

type ResultComponentProps = { result: SearchResult }

const PlatformElement = ({ network }: PlatformElementProps) => (
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

const BlockResult = ({ result }: ResultComponentProps) => (
  <Link
    to={`${ROUTES.BLOCK.url}/${result.protocol}/${result.network}/${result.response.index}`}
  >
    <div className="search-result-container">
      <PlatformElement network={result.network} />
      <div className="search-results-details">
        <div className="search-result-type">
          {ROUTES.BLOCKS.renderIcon()} Block
        </div>
        <div className="search-result-info">
          <div className="search-result-detail">
            <label>Height</label>
            {result.response.index}
          </div>
          <div className="search-result-detail">
            <label>Size</label>
            {result.response.size.toLocaleString()} Bytes
          </div>
          <div className="search-result-detail">
            <label>Date</label>
            {formatDate(result.response.time)}
          </div>

          <div className="search-result-detail">
            <label>Transaction count</label>
            {result.response.txCount}
          </div>
        </div>
      </div>
    </div>
  </Link>
)

const AddressResult = ({ result }: ResultComponentProps) => {
  const width = useWindowWidth()
  return (
    <Link
      to={`${ROUTES.WALLET.url}/${result.protocol}/${result.network}/${result.text}`}
    >
      <div className="search-result-container">
        <PlatformElement network={result.network} />
        <div className="search-results-details">
          <div className="search-result-type">
            {ROUTES.WALLETS.renderIcon()} Address
          </div>
          <div className="search-result-info">
            <div className="search-result-detail">
              <label>Address</label>
              <span>
                {width <= 350
                  ? truncateHash(result.text, width <= 350, undefined, 5)
                  : truncateHash(result.text, width <= 576, undefined, 15)}
              </span>
            </div>
            <div className="search-result-detail">
              <label>Asset Types</label>
              <span>{result.response.length}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

const TransactionResult = ({ result }: ResultComponentProps) => (
  <Link
    to={`${ROUTES.TRANSACTION.url}/${result.protocol}/${result.network}/${result.text}`}
  >
    <div className="search-result-container">
      <PlatformElement network={result.network} />
      <div className="search-results-details">
        <div className="search-result-type">
          {ROUTES.TRANSACTIONS.renderIcon()} Transaction
        </div>
        <div className="search-result-info"></div>
      </div>
    </div>
  </Link>
)

const ContractResult = ({ result }: ResultComponentProps) => (
  <Link
    to={`${ROUTES.CONTRACT.url}/${result.protocol}/${result.network}/${result.text}`}
  >
    <div className="search-result-container">
      <PlatformElement network={result.network} />
      <div className="search-results-details">
        <div className="search-result-type">
          {ROUTES.CONTRACTS.renderIcon()} Contract
        </div>

        <div className="search-result-info">
          <div className="search-result-detail">
            <span> {result.response.manifest.name}</span>
          </div>
        </div>
      </div>
    </div>
  </Link>
)

const resultComponentByType: Record<string, React.FC<ResultComponentProps>> = {
  block: BlockResult,
  balance: AddressResult,
  transaction: TransactionResult,
  contract: ContractResult,
}

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams()
  const { state } = useLocation()
  const { search } = useBlockchainSearch()
  const searchText = searchParams.get('search')

  const isSearchingRef = React.useRef(false)

  const [results, setResults] = React.useState<SearchResult[] | undefined>()

  useEffect(() => {
    async function handle() {
      if (!searchText || isSearchingRef.current) return

      try {
        isSearchingRef.current = true

        console.log({ state })

        if (state?.results) {
          setResults(state.results)
          return
        }

        const result = await search(searchText)
        setResults(result)
      } catch (error) {
        console.error(error)
      } finally {
        isSearchingRef.current = false
      }
    }

    handle()
  }, [searchText, state])

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
          Showing results for <div className="results">"{searchText}"</div>
        </div>

        {!results ? (
          <SkeletonTheme
            baseColor="#21383d"
            highlightColor="rgb(125 159 177 / 25%)"
          >
            <Skeleton height={120} count={2} className="skeleton-row" />
          </SkeletonTheme>
        ) : results.length === 0 ? (
          <NoResult />
        ) : (
          <div className="results">
            {Object.values(results).map(result => {
              const ResultComponent = resultComponentByType[result.type]

              return (
                <ResultComponent
                  result={result}
                  key={`${result.type}-${result.network}-${result.protocol}-${result.text}`}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchResults
