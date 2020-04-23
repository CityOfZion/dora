import React from 'react'
import { render } from '@testing-library/react'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'

import App from './App'
import thunk from 'redux-thunk'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

test('renders learn react link', () => {
  const { getByText } = render(
    <Provider store={mockStore({ block: { cached: {} } })}>
      <App />
    </Provider>,
  )
  const linkElement = getByText(/learn react/i)
  expect(linkElement).toBeInTheDocument()
})
