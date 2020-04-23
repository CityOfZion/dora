import React from 'react'
import { useDispatch } from 'react-redux'

import logo from './logo.svg'
import './App.css'
import { toggleExample } from './actions/testActions'

function App() {
  const dispatch = useDispatch()
  dispatch(toggleExample())

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  )
}

export default App
