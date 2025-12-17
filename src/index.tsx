import { Buffer } from 'buffer';
// import process from 'process';
console.log("polyfill loading")
const processPolyfill = {
  env: {},
  version: '',
  versions: {},
  browser: true,
  nextTick: (fn: Function, ...args: any[]) => {
    setTimeout(() => fn(...args), 0);
  },
};

// Make Buffer available globally
(window as any).Buffer = Buffer;
(window as any).global = window;
(window as any).process = processPolyfill;

globalThis.Buffer = Buffer;
globalThis.process = processPolyfill as any;

console.log('Buffer available:', typeof window.Buffer !== 'undefined');
console.log('process available:', typeof window.process !== 'undefined');

import React from 'react'
import ReactDOM from 'react-dom/client'

import { ChakraProvider } from '@chakra-ui/react'

import { Provider } from 'react-redux'
import 'simple-line-icons/css/simple-line-icons.css'

import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { store } from './store'
import { system } from './ChakraTheme'



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
