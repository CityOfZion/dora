import React, { ReactElement } from 'react'
import Router from './components/navigation/Router'

import './App.scss'
import { initSentry } from './sentry/SentryRoute'

function App(): ReactElement<void> {
  initSentry()
  return (
    <div id="application-wrapper">
      <Router />
    </div>
  )
}

export default App
