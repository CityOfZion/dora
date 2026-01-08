import React, { useState, type ChangeEvent } from 'react'

import SearchIcon from '@mui/icons-material/Search'
import './Search.scss'

import { useNavigate, useSearchParams } from 'react-router-dom'
import { ROUTES, SEARCH_TYPES } from '../../constants'
import useWindowWidth from '../../hooks/useWindowWidth'
import { useBlockchainSearch } from '../../hooks/useBlockchainSearch'

const Search: React.FC<{}> = () => {
  const navigate = useNavigate()
  const width = useWindowWidth()
  const [searchParams] = useSearchParams()

  const { search } = useBlockchainSearch()

  const [text, setText] = useState(searchParams.get('search') || '')

  const placeholder =
    width > 900
      ? 'Search for block height, hash, address, or transaction ID'
      : 'Search for block height, hash or address...'

  async function handleSearch(event: React.SyntheticEvent) {
    event.preventDefault()

    const results = await search(text)

    if (results.length === 1) {
      switch (results[0].type) {
        case 'block':
          navigate(
            `${ROUTES.BLOCK.url}/${results[0].protocol}/${results[0].network}/${text}`,
          )
          break
        case 'balance':
          navigate(
            `${ROUTES.WALLET.url}/${results[0].protocol}/${results[0].network}/${text}`,
          )
          break
        case 'contract':
          navigate(
            `${ROUTES.CONTRACT.url}/${results[0].protocol}/${results[0].network}/${text}`,
          )
          break
        case 'transaction':
          navigate(
            `${ROUTES.TRANSACTION.url}/${results[0].protocol}/${results[0].network}/${text}`,
          )
          break
        case SEARCH_TYPES.ENDPOINT:
          navigate(`${ROUTES.ENDPOINT.url}/${text}`)
          break
        default:
          break
      }

      return
    }

    navigate(`${ROUTES.SEARCH.url}/all/all?search=${text}`)
  }

  function handleTextChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value.replace(',', '')
    setText(value)
  }

  return (
    <div id="Search">
      <form onSubmit={handleSearch}>
        <input
          value={text}
          onChange={handleTextChange}
          placeholder={placeholder}
        />

        <SearchIcon onClick={handleSearch} />
      </form>
    </div>
  )
}

export default Search
