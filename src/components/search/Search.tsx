import React, { useState, useEffect } from 'react'

import { ReactComponent as Magnify } from '../../assets/icons/magnify.svg'
import './Search.scss'
import { handleSearchInput } from '../../actions/searchActions'
import { State as SearchState } from '../../reducers/searchReducer'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { SEARCH_TYPES } from '../../constants'

const Search: React.FC<{}> = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const [searchValue, updateSearchValue] = useState('')
  const searchState = useSelector(
    ({ search }: { search: SearchState }) => search,
  )
  const { searchType } = searchState

  useEffect(() => {
    switch (searchType) {
      case SEARCH_TYPES.TRANSACTION:
        return history.push(`/transaction/${searchValue}`)
      case SEARCH_TYPES.CONTRACT:
        return history.push(`/contract/${searchValue}`)
      case SEARCH_TYPES.ADDRESS:
        return history.push(`/address/${searchValue}`)
      case SEARCH_TYPES.BLOCK:
        return history.push(`/block/${searchValue}`)
      default:
        break
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
