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

const useFilterState = (
  filter?: Filter,
  defaultProtocol?: string,
  defaultNetwork?: string,
): FilterState => {
  const DEFAULT_FILTER: Filter = {
    protocol: defaultProtocol ?? 'all',
    network: defaultNetwork ?? 'all',
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
