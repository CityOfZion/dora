import React, { ReactElement } from 'react'
import Router from './components/navigation/Router'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

import './App.css'

function App(): ReactElement<void> {
  return (
    <div id="application-wrapper">
      <SkeletonTheme
        color="rgba(255, 255, 255, 0.00)"
        highlightColor="rgba(255, 255, 255, 0.04)"
      >
        <Router />
      </SkeletonTheme>
    </div>
  )
}

export default App
