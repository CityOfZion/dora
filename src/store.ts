import { configureStore } from '@reduxjs/toolkit'
import { logger } from 'redux-logger'
import type { ThunkAction } from 'redux-thunk'
import { State as BlockState } from './reducers/blockReducer'
import rootReducer from './reducers/rootReducer'
import { State as TransactionState } from './reducers/transactionReducer'
import { State as NetworkState } from './reducers/networkReducer'
import { Action } from 'redux'

export type GlobalState = {
  block: BlockState
  transaction: TransactionState
  network: NetworkState
}

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    process.env.NODE_ENV === 'production'
      ? getDefaultMiddleware()
      : getDefaultMiddleware().concat(logger),
})

export type RootState = ReturnType<typeof store.getState>
export type AppThunkDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState, // the entire store state
  unknown, // extra argument (usually unused)
  Action<string> // action type
>
