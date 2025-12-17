import React, { useEffect } from 'react'

import SearchIcon from '@mui/icons-material/Search'
import './Search.scss'
import {
  handleSearchInput,
  updateSearchInput,
  clearSearchInputState,
} from '../../actions/searchActions'
import { State as SearchState } from '../../reducers/searchReducer'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ROUTES, SEARCH_TYPES } from '../../constants'
import useWindowWidth from '../../hooks/useWindowWidth'
import { AppThunkDispatch } from '../../store'

const Search: React.FC<{}> = () => {
  const dispatch = useDispatch<AppThunkDispatch>()
  const navigate = useNavigate()
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
        navigate(`${ROUTES.SEARCH.url}/all/all/${searchValue}`)
      } else if (results && results[0]) {
        dispatch(clearSearchInputState())
        let url = ''
        switch (results[0].type) {
          case 'block':
            url = ROUTES.BLOCK.url
            navigate(
              `${url}/${results[0].protocol}/${results[0].network}/${searchValue}`,
            )
            break
          case 'balance':
            url = ROUTES.WALLET.url
            navigate(
              `${url}/${results[0].protocol}/${results[0].network}/${searchValue}`,
            )
            break
          case 'contract':
            url = ROUTES.CONTRACT.url
            navigate(
              `${url}/${results[0].protocol}/${results[0].network}/${searchValue}`,
            )
            break
          case 'transaction':
            url = ROUTES.TRANSACTION.url
            navigate(
              `${url}/${results[0].protocol}/${results[0].network}/${searchValue}`,
            )
            break
          case SEARCH_TYPES.ENDPOINT:
            dispatch(clearSearchInputState())
            navigate(`${ROUTES.ENDPOINT.url}/${searchValue}`)
            break
          default:
            break
        }
      }
    }

    if (error) {
      navigate(ROUTES.NOT_FOUND.url)
    }
  }, [
    chain,
    dispatch,
    error,
    navigate,
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
