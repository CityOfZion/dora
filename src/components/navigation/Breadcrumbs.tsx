import React, { ReactElement } from 'react'
import { NavLink } from 'react-router-dom'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

import './Breadcrumbs.scss'

type Crumb = {
  url: string
  label: string
  active?: boolean
}

type Props = {
  crumbs: Crumb[]
}

const Breadcrumbs: React.FC<Props> = ({ crumbs }): ReactElement => (
  <div id="Breadcrumbs">
    {crumbs.map((crumb, i) => (
      <div className="crumb-container" key={crumb.label}>
        <NavLink
          to={crumb.active ? '#' : crumb.url}
          className={({ isActive }) =>
            crumb.active || isActive ? 'active-breadcrumb' : ''
          }
        >
          {crumb.label}
        </NavLink>
        {i + 1 < crumbs.length && (
          <ChevronRightIcon style={{ color: '#7d9fb1', height: '20px' }} />
        )}
      </div>
    ))}
  </div>
)

export default Breadcrumbs
