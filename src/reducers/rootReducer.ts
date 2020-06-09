import { combineReducers } from 'redux'
import block from './blockReducer'
import transaction from './transactionReducer'
import contract from './contractReducer'

export default combineReducers({
  block,
  transaction,
  contract,
})
