import { createStore, applyMiddleware, Store } from 'redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'

import { State as BlockState } from './reducers/blockReducer'
import rootReducer from './reducers/rootReducer'
import { State as TransactionState } from './reducers/transactionReducer'

export type GlobalState = {
  block: BlockState
  transaction: TransactionState
}

// TODO: initial state should match the definition above
export const INITIAL_STATE = {}

const loggerMiddleware = createLogger()

export default function configureStore(initialState = INITIAL_STATE): Store {
  return createStore(
    rootReducer,
    initialState,
    process.env.NODE_ENV === 'production'
      ? applyMiddleware(thunk)
      : applyMiddleware(thunk, loggerMiddleware),
  )
}
