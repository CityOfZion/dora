import React, { useEffect } from 'react'

import SearchIcon from '@material-ui/icons/Search'
import './Search.scss'
import {
  handleSearchInput,
  updateSearchInput,
  clearSearchInputState,
} from '../../actions/searchActions'
import { State as SearchState } from '../../reducers/searchReducer'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ROUTES, SEARCH_TYPES } from '../../constants'
import useWindowWidth from '../../hooks/useWindowWidth'

const Search: React.FC<{}> = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const width = useWindowWidth()

  const searchState = useSelector(
    ({ search }: { search: SearchState }) => search,
  )

  const { error, searchValue, searchType, results } = searchState
  const network = 'mainnet'
  const chain = 'neo3'
  const placeholder =
    width > 900
      ? 'Search for block height, hash, address, or transaction ID'
      : 'Search for block height, hash or address...'

  useEffect(() => {
    if (searchValue && searchType && results && results.length > 0) {
      if (results && results.length > 1) {
        dispatch(clearSearchInputState())
        return history.push(`${ROUTES.SEARCH.url}/all/all/${searchValue}`)
      } else if (results && results[0]) {
        dispatch(clearSearchInputState())
        let url = ''
        switch (results[0].type) {
          case 'block':
            url = ROUTES.BLOCK.url
            return history.push(
              `${url}/${results[0].protocol}/${results[0].network}/${searchValue}`,
            )
          case 'balance':
            url = ROUTES.WALLET.url
            return history.push(
              `${url}/${results[0].protocol}/${results[0].network}/${searchValue}`,
            )
          case 'contract':
            url = ROUTES.CONTRACT.url
            return history.push(
              `${url}/${results[0].protocol}/${results[0].network}/${searchValue}`,
            )
          case 'transaction':
            url = ROUTES.TRANSACTION.url
            return history.push(
              `${url}/${results[0].protocol}/${results[0].network}/${searchValue}`,
            )

          case SEARCH_TYPES.ENDPOINT:
            dispatch(clearSearchInputState())
            return history.push(`${ROUTES.ENDPOINT.url}/${searchValue}`)

          default:
            break
        }
      }
    }

    if (error) {
      history.push(ROUTES.NOT_FOUND.url)
    }
  }, [
    chain,
    dispatch,
    error,
    history,
    network,
    results,
    searchType,
    searchValue,
  ])

  function handleSearch(e: React.SyntheticEvent): void {
    e.preventDefault()
    dispatch(handleSearchInput(searchValue || ''))
  }

  function updateSearch(searchTerms: string): void {
    dispatch(updateSearchInput(searchTerms))
  }

  return (
    <div id="Search">
      <form onSubmit={handleSearch}>
        <input
          value={searchValue || ''}
          onChange={(e: React.SyntheticEvent): void => {
            const target = e.target as HTMLInputElement
            const searchTerms = target.value

            updateSearch(searchTerms)
          }}
          placeholder={placeholder}
        ></input>{' '}
        <SearchIcon onClick={handleSearch} />
      </form>
    </div>
  )
}

export default Search
