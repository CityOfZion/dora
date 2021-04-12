import React from 'react'

import './InformationPanel.scss'

const InformationPanel: React.FC<{
  title: string
  icon: React.ReactNode
  data: string
  children?: React.ReactNode
}> = ({ title, icon, data, children }) => {
  return (
    <div className="information-panel-container">
      <div className="information-panel-header">
        <div className="information-panel-title">{title}</div>
      </div>
      <div className="information-panel-data">
        {icon}
        <h1>{data}</h1>
      </div>
    </div>
  )
}

export default InformationPanel
