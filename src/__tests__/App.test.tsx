import React from 'react'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import toJson from 'enzyme-to-json'
import { shallow } from 'enzyme'

import App from '../App'
import thunk from 'redux-thunk'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

test('renders without crashing', () => {
  const tree = shallow(
    <Provider
      store={mockStore({
        block: { isLoading: false, list: [] },
        transaction: { isLoading: false, list: [] },
      })}
    >
      <App />
    </Provider>,
  )

  expect(toJson(tree)).toMatchSnapshot()
})
