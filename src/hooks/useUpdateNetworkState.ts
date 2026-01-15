import { useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { changeNetwork, changeChain } from '../actions/networkActions'
import { State as NetworkState } from '../reducers/networkReducer'
import { AppThunkDispatch } from '../store'

interface MatchParams extends Record<string, string | undefined> {
  chain: string
  network: string
}

const useUpdateNetworkState = (): void => {
  const networkState = useSelector(
    ({ network }: { network: NetworkState }) => network,
  )
  const dispatch = useDispatch<AppThunkDispatch>()

  const { chain, network } = useParams<MatchParams>()

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
