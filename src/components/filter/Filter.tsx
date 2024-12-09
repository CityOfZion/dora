import React, { ReactElement, useEffect, useState } from 'react'
import Select from '../select/Select'
import { ValueType } from 'react-select'

import './Filter.scss'

export interface Platform {
  protocol: string
  network: string
}

export interface Option {
  value: Platform | string
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
      value: {
        protocol: 'all',
        network: 'all',
      },
    },
    {
      label: 'Mainnet',
      value: {
        protocol: 'neo3',
        network: 'mainnet',
      },
    },
    {
      label: 'Testnet',
      value: {
        protocol: 'neo3',
        network: 'testnet',
      },
    },
  ]

  // TODO: this should read redux state to set default
  const [currentOption, setCurrentOption] = useState(options[0])

  const setFilter = (option: ValueType<Option, false>): void => {
    const filterOption = option as Option
    handleFilterUpdate(filterOption)
    setCurrentOption(filterOption)
  }

  useEffect(() => {
    const { protocol, network } = (selectedOption?.value || {}) as Platform
    const option = options.find(it => {
      const selectedOptionPlataform = it?.value as Platform
      return (
        selectedOptionPlataform.protocol === protocol &&
        selectedOptionPlataform.network === network
      )
    })
    if (option) setCurrentOption(option)
  }, [selectedOption])

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
