import { createStore, applyMiddleware, Store } from 'redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'

import { State as BlockState } from './reducers/blockReducer'
import rootReducer from './reducers/rootReducer'
import { State as TransactionState } from './reducers/transactionReducer'
import { State as NetworkState } from './reducers/networkReducer'

export type GlobalState = {
  block: BlockState
  transaction: TransactionState
  network: NetworkState
}

// TODO: initial state should match the definition above
export const INITIAL_STATE = {}

const loggerMiddleware = createLogger()

function configureStore(initialState = INITIAL_STATE): Store {
  return createStore(
    rootReducer,
    initialState,
    process.env.NODE_ENV === 'production'
      ? applyMiddleware(thunk)
      : applyMiddleware(thunk, loggerMiddleware),
  )
}
export const store = configureStore()
