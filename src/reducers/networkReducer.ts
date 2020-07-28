import { CHANGE_NETWORK } from '../actions/networkActions'
import { AnyAction } from 'redux'

export type State = {
  network: string
}

export default (
  state: State = {
    network: 'mainnet',
  },
  action: AnyAction,
): State => {
  switch (action.type) {
    case CHANGE_NETWORK:
      return Object.assign({}, state, {
        network: action.network,
      })
    default:
      return state
  }
}
