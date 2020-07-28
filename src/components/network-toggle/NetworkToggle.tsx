import React, { ReactElement } from 'react'
import Select from '../select/Select'
import { ValueType } from 'react-select'
import { useSelector, useDispatch } from 'react-redux'
import { State as NetworkState } from '../../reducers/networkReducer'
import { changeNetwork } from '../../actions/networkActions'

type Option = {
  value: string
  label: string
}

export const NetworkToggle: React.FC<{}> = (): ReactElement => {
  const options: Option[] = [
    {
      label: 'Mainnet',
      value: 'mainet',
    },
    {
      label: 'Testnet',
      value: 'testnet',
    },
  ]
  const networkState = useSelector(
    ({ network }: { network: NetworkState }) => network,
  )
  const selectedNetworkOption =
    options.find(option => option.value === networkState.network) || options[0]

  const dispatch = useDispatch()

  const handleChange = (option: ValueType<Option>): void => {
    const networkOption = option as Option
    dispatch(changeNetwork(networkOption.value))
  }

  return (
    <Select
      selectedOption={selectedNetworkOption}
      handleChange={handleChange}
      options={options}
    />
  )
}

export default NetworkToggle
