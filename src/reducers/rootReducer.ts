import { combineReducers } from 'redux'
import block from './blockReducer'
import transaction from './transactionReducer'
import contract from './contractReducer'
import address from './addressReducer'
import search from './searchReducer'
import menu from './menuReducer'
import network from './networkReducer'

export default combineReducers({
  block,
  transaction,
  contract,
  address,
  search,
  menu,
  network,
})
