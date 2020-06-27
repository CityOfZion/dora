import React, { useState, useEffect } from 'react'

import { ReactComponent as Magnify } from '../../assets/icons/magnify.svg'
import './Search.scss'
import { handleSearchInput } from '../../actions/searchActions'
import { State as SearchState } from '../../reducers/searchReducer'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { SEARCH_TYPES, ROUTES } from '../../constants'

const Search: React.FC<{}> = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const [searchValue, updateSearchValue] = useState('')
  const searchState = useSelector(
    ({ search }: { search: SearchState }) => search,
  )
  const { searchType } = searchState

  useEffect(() => {
    console.log({ searchType, searchValue })
    if (searchType && searchValue) {
      switch (searchType) {
        case SEARCH_TYPES.TRANSACTION:
          history.push(`${ROUTES.TRANSACTION.url}/${searchValue}`)
          return updateSearchValue('')
        case SEARCH_TYPES.CONTRACT:
          history.push(`${ROUTES.CONTRACT.url}/${searchValue}`)
          return updateSearchValue('')
        case SEARCH_TYPES.ADDRESS:
          history.push(`${ROUTES.WALLET.url}/${searchValue}`)
          return updateSearchValue('')
        case SEARCH_TYPES.BLOCK:
          history.push(`${ROUTES.BLOCK.url}/${searchValue}`)
          return updateSearchValue('')
        default:
          break
      }
    }
  }, [history, searchType, searchValue])

  function handleSearch(e: React.SyntheticEvent): void {
    e.preventDefault()
    dispatch(handleSearchInput(searchValue))
  }

  function updateSearch(e: React.SyntheticEvent): void {
    const target = e.target as HTMLInputElement
    const searchTerms = target.value
    updateSearchValue(searchTerms)
  }

  return (
    <div id="Search">
      <form onSubmit={handleSearch}>
        <input
          value={searchValue}
          onChange={updateSearch}
          placeholder="Search for Block Height, Hash, Address or transaction id"
        ></input>{' '}
        <Magnify onClick={handleSearch} />
      </form>
    </div>
  )
}

export default Search
