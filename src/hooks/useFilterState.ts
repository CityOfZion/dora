import { useState } from 'react'

type Filter = {
  protocol: string
  network: string
}

export interface FilterState {
  protocol: string
  handleSetFilterData: (filter: Filter) => void
  network: string
}

const useFilterState = (filter?: Filter): FilterState => {
  const DEFAULT_FILTER: Filter = {
    protocol: 'all',
    network: 'all',
  }

  const [filterData, setFilterData] = useState(filter || DEFAULT_FILTER)

  function handleSetFilterData(filter: Filter): void {
    setFilterData(filter)
  }
  return {
    protocol: filterData.protocol,
    handleSetFilterData,
    network: filterData.network,
  }
}

export default useFilterState
