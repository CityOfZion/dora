import React, { ReactElement } from 'react'

import './App.css'
import Home from './pages/home/Home'

function App(): ReactElement<void> {
  return (
    <div className="App">
      <Home />
    </div>
  )
}

export default App
