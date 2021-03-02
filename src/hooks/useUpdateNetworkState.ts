import { useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'

import { changeNetwork, changeChain } from '../actions/networkActions'
import { State as NetworkState } from '../reducers/networkReducer'

interface MatchParams {
  chain: string
  network: string
}

type Props = RouteComponentProps<MatchParams>

const useUpdateNetworkState = (props: Props): void => {
  const networkState = useSelector(
    ({ network }: { network: NetworkState }) => network,
  )
  const dispatch = useDispatch()

  const { chain, network } = props.match.params

  useEffect(() => {
    if (network && networkState.network !== network) {
      dispatch(changeNetwork(network))
    }

    if (chain && networkState.chain !== chain) {
      dispatch(changeChain(chain))
    }
  }, [chain, dispatch, network, networkState.chain, networkState.network])
}

export default useUpdateNetworkState
