import { treatNetwork } from '../constants'
import { store } from '../store'

export function getNetworkAndProtocol(): [string, string] {
  const network = treatNetwork(store.getState().network.network)
  const chain = store.getState().network.chain
  return [network, chain]
}
