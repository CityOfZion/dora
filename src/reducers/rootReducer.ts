import { combineReducers } from 'redux'
import block from './blockReducer'
import transaction from './transactionReducer'

export default combineReducers({
  block,
  transaction,
})
