import { useEffect } from 'react'
import { Platform } from '../components/filter/Filter'
import { useLocation, useNavigate, NavigateFunction } from 'react-router'
import useFilterState, { FilterState } from './useFilterState'

const useFilterStateWithFilter = (
  navigate: NavigateFunction,
  defaultProtocol?: string,
  defaultNetwork?: string,
): FilterState => {
  const location = useLocation()
  const { protocol, network } = (location.state || {}) as Platform
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
      navigate(location.pathname, {
        replace: true,
        state: {
          protocol: filter.protocol,
          network: filter.network,
        },
      })
    }
  }, [filter.protocol, filter.network, navigate, location.pathname])

  return filter
}

export default useFilterStateWithFilter
