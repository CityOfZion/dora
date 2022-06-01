import { useEffect } from 'react'
import { Platform } from '../components/filter/Filter'
import { History } from 'history'
import useFilterState, { FilterState } from './useFilterState'

const useFilterStateWithFilter = (
  history: History,
  defaultProtocol?: string,
  defaultNetwork?: string,
): FilterState => {
  const { protocol, network } = (history.location.state || {}) as Platform
  const verify = () => {
    if (protocol && network) {
      return {
        protocol,
        network,
      }
    }
  }
  const filter = useFilterState(verify(), defaultProtocol, defaultNetwork)

  useEffect(() => {
    if (filter.protocol && filter.network) {
      history.replace(history.location.pathname, {
        protocol: filter.protocol,
        network: filter.network,
      })
    }
  }, [filter.protocol, filter.network])

  return filter
}

export default useFilterStateWithFilter
