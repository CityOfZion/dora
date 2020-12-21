import { useState } from 'react'
import { useSelector } from 'react-redux'

import { State as NetworkState } from '../reducers/networkReducer'

type Filter = {
  selectedChain: string
}

interface FilterState {
  selectedChain: string
  handleSetFilterData: (filter: Filter) => void
  network: string
}

const useFilterState = (): FilterState => {
  const DEFAULT_FILTER: Filter = {
    selectedChain: 'all',
  }

  const networkState = useSelector(
    ({ network }: { network: NetworkState }) => network,
  )

  const [filterData, setFilterData] = useState(DEFAULT_FILTER)

  const { selectedChain } = filterData

  function handleSetFilterData(filter: Filter): void {
    setFilterData(filter)
  }

  return {
    selectedChain,
    handleSetFilterData,
    network: networkState.network,
  }
}

export default useFilterState
