import React from 'react'

import './Monitor.scss'
import { ROUTES } from '../../constants'
import Breadcrumbs from '../../components/navigation/Breadcrumbs'
import imgMonitor from '../../assets/icons/monitor.png'

const Monitor: React.FC<{}> = () => {
  return (
    <div id="Monitor" className="page-container">
      <div className="list-wrapper">
        <Breadcrumbs
          crumbs={[
            {
              url: ROUTES.HOME.url,
              label: 'Home',
            },
            {
              url: '#',
              label: 'Monitor',
              active: true,
            },
          ]}
        />

        <div className="page-title-container">
          <img src={imgMonitor} alt="" />
          <h1>{ROUTES.MONITOR.name}</h1>
        </div>
      </div>
    </div>
  )
}

export default Monitor
