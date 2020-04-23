import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'

import rootReducer from './reducers/rootReducer'

export const INITIAL_STATE = {}

const loggerMiddleware = createLogger()

export default function configureStore(initialState = INITIAL_STATE) {
  return createStore(
    rootReducer,
    initialState,
    process.env.NODE_ENV === 'production'
      ? applyMiddleware(thunk)
      : applyMiddleware(thunk, loggerMiddleware),
  )
}
