import React from 'react'

import './NotFound.scss'
import { ROUTES } from '../../constants'
import Breadcrumbs from '../../components/navigation/Breadcrumbs'
import { NoResult } from '../../components/no-result/NoResult'

const NotFound: React.FC = () => {
  return (
    <div id="NotFound" className="page-container">
      <div className="list-wrapper">
        <Breadcrumbs
          crumbs={[
            {
              url: ROUTES.HOME.url,
              label: 'Home',
            },
            {
              url: '#',
              label: 'Page not found',
              active: true,
            },
          ]}
        />
        <div className="page-title-container">
          {ROUTES.NOT_FOUND.renderIcon()}
          <h1>{ROUTES.NOT_FOUND.name}</h1>
        </div>

        <NoResult />
      </div>
    </div>
  )
}

export default NotFound
