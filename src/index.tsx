import React from 'react'
import ReactDOM from 'react-dom'

import { ChakraProvider } from '@chakra-ui/react'

import { Provider } from 'react-redux'
import 'simple-line-icons/css/simple-line-icons.css'

import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { store } from './store'
import { theme } from './ChakraTheme'

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <Provider store={store}>
        <App />
      </Provider>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)

navigator.serviceWorker &&
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (const registration of registrations) {
      registration && registration.unregister()
    }
  })

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
