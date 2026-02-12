import { useSelector } from 'react-redux'
import { State as NetworkState } from '../reducers/networkReducer'

const useNetworkGlobalSelector = () => {
  const networkState = useSelector(
    ({ network }: { network: NetworkState }) => network,
  )
  return networkState ?? { network: 'mainnet', chain: 'neo3' }
}

export default useNetworkGlobalSelector
