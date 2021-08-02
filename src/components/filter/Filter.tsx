import React, { ReactElement, useState } from 'react'
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
      label: 'Neo N3 (Mainnet)',
      value: {
        protocol: 'neo3',
        network: 'mainnet',
      },
    },
    {
      label: 'Neo N3 (RC3 Testnet)',
      value: {
        protocol: 'neo3',
        network: 'testnet',
      },
    },
    {
      label: 'Neo N3 (RC4 Testnet)',
      value: {
        protocol: 'neo3',
        network: 'testnet_rc4',
      },
    },
    {
      label: 'Neo Legacy (Mainnet)',
      value: {
        protocol: 'neo2',
        network: 'mainnet',
      },
    },
    {
      label: 'Neo Legacy (Testnet)',
      value: {
        protocol: 'neo2',
        network: 'testnet',
      },
    },
  ]

  // TODO: this should read redux state to set default
  const [currentOption, setCurrentOption] = useState(
    selectedOption || options[0],
  )

  const setFilter = (option: ValueType<Option, false>): void => {
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
