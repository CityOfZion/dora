import React, { ReactElement } from 'react'
import Router from './components/navigation/Router'

import './App.css'

function App(): ReactElement<void> {
  return (
    <div id="application-wrapper">
      <Router />
    </div>
  )
}

export default App
