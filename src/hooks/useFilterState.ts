import { useState } from 'react'

type Filter = {
  protocol: string
  network: string
}

interface FilterState {
  protocol: string
  handleSetFilterData: (filter: Filter) => void
  network: string
}

const useFilterState = (): FilterState => {
  const DEFAULT_FILTER: Filter = {
    protocol: 'all',
    network: 'all',
  }

  const [filterData, setFilterData] = useState(DEFAULT_FILTER)

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
