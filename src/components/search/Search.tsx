import React, { useState, type ChangeEvent } from 'react'

import SearchIcon from '@mui/icons-material/Search'
import './Search.scss'

import { useNavigate, useSearchParams } from 'react-router-dom'
import { ROUTES, SEARCH_TYPES } from '../../constants'
import useWindowWidth from '../../hooks/useWindowWidth'
import { useBlockchainSearch } from '../../hooks/useBlockchainSearch'

const Search: React.FC = () => {
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
      const routesOptions: Record<string, string> = {
        [SEARCH_TYPES.BLOCK]: ROUTES.BLOCK.url,
        [SEARCH_TYPES.BALANCE]: ROUTES.WALLET.url,
        [SEARCH_TYPES.CONTRACT]: ROUTES.CONTRACT.url,
        [SEARCH_TYPES.TRANSACTION]: ROUTES.TRANSACTION.url,
        [SEARCH_TYPES.ENDPOINT]: ROUTES.ENDPOINT.url,
      }

      const [result] = results
      const type = result.type.toString().toUpperCase()
      const startUrl = routesOptions[type]

      let path
      switch (type) {
        case SEARCH_TYPES.BLOCK:
          path = `${startUrl}/${result.protocol}/${result.network}/${result.response.index}`
          break
        case SEARCH_TYPES.ENDPOINT:
          path = `${startUrl}/${text}`
          break
        default:
          path = `${startUrl}/${result.protocol}/${result.network}/${text}`
      }
      return navigate(path)
    }

    navigate(`${ROUTES.SEARCH.url}/all/all?search=${text}`, {
      state: { results },
    })
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
