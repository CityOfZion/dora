import { treatNetwork } from '../constants'
import { store } from '../store'

export function getNetworkAndProtocol(): [string, string] {
  const { network, chain } = store.getState().network
  return [treatNetwork(network), chain]
}
