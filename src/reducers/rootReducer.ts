import { combineReducers } from 'redux'
import blockReducer from './blockReducer'

export default combineReducers({
  block: blockReducer,
})
