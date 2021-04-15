import React, { ReactElement } from 'react'
import Select from '../select/Select'
import { ValueType } from 'react-select'
import { useSelector, useDispatch } from 'react-redux'
import { State as NetworkState } from '../../reducers/networkReducer'
import { changeNetwork } from '../../actions/networkActions'

import './NetworkToggle.scss'
import { resetAddressState } from '../../actions/addressActions'
import {
  fetchContracts,
  resetContractState,
} from '../../actions/contractActions'
import { fetchBlocks, resetBlockState } from '../../actions/blockActions'
import {
  fetchTransactions,
  resetTransactionState,
} from '../../actions/transactionActions'
import { useHistory } from 'react-router-dom'
import { ROUTES } from '../../constants'

type Option = {
  value: string
  label: string
}

export const NetworkToggle: React.FC<{ disabled: boolean }> = ({
  disabled,
}): ReactElement => {
  const dispatch = useDispatch()
  const history = useHistory()

  const options: Option[] = [
    {
      label: 'Mainnet',
      value: 'mainnet',
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

  const handleChange = (option: ValueType<Option, false>): void => {
    const networkOption = option as Option
    dispatch(changeNetwork(networkOption.value))
    dispatch(resetAddressState())
    dispatch(resetBlockState())
    dispatch(resetContractState())
    dispatch(resetTransactionState())
    dispatch(fetchContracts())
    dispatch(fetchBlocks())
    dispatch(fetchTransactions())
  }

  return (
    <div id="NetworkToggle">
      <Select
        selectedOption={selectedNetworkOption}
        handleChange={handleChange}
        options={options}
        disabled={disabled}
      />
    </div>
  )
}

export default NetworkToggle
