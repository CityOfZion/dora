import React, { ReactElement } from 'react'

import './Navigation.scss'
import { ReactComponent as ResourceLogo } from '../../assets/icons/coz-resource-logo.svg'

const Navigation: React.FC = (): ReactElement => {
  return (
    <div id="navigation-container">
      <ResourceLogo />

      {/* <SeachInput />

      <LanguageDropdown /> */}
    </div>
  )
}

export default Navigation
