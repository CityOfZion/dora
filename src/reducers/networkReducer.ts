import { CHANGE_NETWORK, CHANGE_CHAIN } from '../actions/networkActions'
import { AnyAction } from 'redux'

export type State = {
  network: string
  chain: string
}

export default (
  state: State = {
    network: 'mainnet',
    chain: '',
  },
  action: AnyAction,
): State => {
  switch (action.type) {
    case CHANGE_NETWORK:
      return Object.assign({}, state, {
        network: action.network,
      })

    case CHANGE_CHAIN:
      return Object.assign({}, state, {
        chain: action.chain,
      })
    default:
      return state
  }
}
