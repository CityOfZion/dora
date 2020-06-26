import React from 'react'

import { ReactComponent as Magnify } from '../../assets/icons/magnify.svg'
import './Search.scss'

import { useHistory } from 'react-router-dom'

const Search: React.FC<{}> = () => {
  return (
    <div id="Search">
      <form>
        <input placeholder="Search for Block Height, Hash, Address or transaction id"></input>{' '}
        <Magnify />
      </form>
    </div>
  )
}

export default Search
