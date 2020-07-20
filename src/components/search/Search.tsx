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
import { SEARCH_TYPES, ROUTES } from '../../constants'

const Search: React.FC<{}> = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const searchState = useSelector(
    ({ search }: { search: SearchState }) => search,
  )
  const { searchType, error, searchValue } = searchState

  useEffect(() => {
    if (searchType && searchValue) {
      switch (searchType) {
        case SEARCH_TYPES.TRANSACTION:
          dispatch(clearSearchInputState())
          return history.push(`${ROUTES.TRANSACTION.url}/${searchValue}`)

        case SEARCH_TYPES.CONTRACT:
          dispatch(clearSearchInputState())
          return history.push(`${ROUTES.CONTRACT.url}/${searchValue}`)

        case SEARCH_TYPES.ADDRESS:
          dispatch(clearSearchInputState())
          return history.push(`${ROUTES.WALLET.url}/${searchValue}`)

        case SEARCH_TYPES.BLOCK:
          dispatch(clearSearchInputState())
          return history.push(`${ROUTES.BLOCK.url}/${searchValue}`)

        default:
          break
      }
    }
    if (error) {
      history.push(ROUTES.NOT_FOUND.url)
    }
  }, [dispatch, error, history, searchType, searchValue])

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
          placeholder="Search for Block Height, Hash, Address or transaction id"
        ></input>{' '}
        <SearchIcon onClick={handleSearch} />
      </form>
    </div>
  )
}

export default Search
