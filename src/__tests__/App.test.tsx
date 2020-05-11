import React from 'react'
import renderer from 'react-test-renderer'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'

import App from '../App'
import thunk from 'redux-thunk'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

test('renders without crashing', () => {
  const tree = renderer
    .create(
      <Provider
        store={mockStore({
          block: { isLoading: false, list: [] },
          transaction: { isLoading: false, list: [] },
        })}
      >
        <App />
      </Provider>,
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
