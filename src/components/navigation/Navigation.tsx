import React, { ReactElement } from 'react'

import './Navigation.scss'
import { ReactComponent as ResourceLogo } from '../../assets/icons/coz-resource-logo.svg'
import Search from '../search/Search'

const Navigation: React.FC = (): ReactElement => {
  return (
    <div id="navigation-container">
      <div id="coz-blockchain-logo">
        <ResourceLogo />
      </div>

      <Search />

      {/* <SeachInput />

      <LanguageDropdown /> */}
    </div>
  )
}

export default Navigation
