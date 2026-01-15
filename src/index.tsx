import React from 'react'
import ReactDOM from 'react-dom/client'

import { ChakraProvider } from '@chakra-ui/react'

import { Provider } from 'react-redux'
import 'simple-line-icons/css/simple-line-icons.css'
import 'react-loading-skeleton/dist/skeleton.css'

import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { store } from './store'
import { system } from './ChakraTheme'

import '@workday/canvas-tokens-web/css/base/_variables.css'
import '@workday/canvas-tokens-web/css/system/_variables.css'

const container = document.getElementById('root')
if (!container) {
  throw new Error('Root container not found')
}

const root = ReactDOM.createRoot(container)
root.render(
  <React.StrictMode>
    <ChakraProvider value={system}>
      <Provider store={store}>
        <App />
      </Provider>
    </ChakraProvider>
  </React.StrictMode>,
)

navigator.serviceWorker?.getRegistrations().then(registrations => {
  for (const registration of registrations) {
    registration?.unregister()
  }
})

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
