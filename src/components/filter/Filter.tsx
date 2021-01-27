import React, { ReactElement, useState } from 'react'
import Select from '../select/Select'
import { ValueType } from 'react-select'

import './Filter.scss'

type Option = {
  value: string
  label: string
}

interface Props {
  handleFilterUpdate: (option: Option) => void
  selectedOption?: Option
}

export const Filter: React.FC<Props> = ({
  handleFilterUpdate,
  selectedOption,
}): ReactElement => {
  const options: Option[] = [
    {
      label: 'All',
      value: 'all',
    },
    {
      label: 'NEO 2',
      value: 'neo2',
    },
    {
      label: 'NEO 3',
      value: 'neo3',
    },
  ]

  // TODO: this should read redux state to set default
  const [currentOption, setCurrentOption] = useState(
    selectedOption || options[1],
  )

  const setFilter = (option: ValueType<Option>): void => {
    const filterOption = option as Option
    handleFilterUpdate(filterOption)
    setCurrentOption(filterOption)
  }

  return (
    <div id="Filter">
      <Select
        selectedOption={currentOption}
        handleChange={setFilter}
        options={options}
      />
    </div>
  )
}

export default Filter
