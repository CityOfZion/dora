import React, { ReactElement } from 'react'
import Select from '../select/Select'
import { Link } from 'react-router-dom'
import { ValueType } from 'react-select'

import ExpandingPanel from '../panel/ExpandingPanel'
import './Notification.scss'

import {
  TX_STATE_TYPE_MAPPINGS,
  ADDRESS_OPTION,
  HEX_STRING_OPTION,
  STRING_OPTION,
} from '../../constants'
import { TransactionNotification } from '../../reducers/transactionReducer'

type Option = {
  value: string
  label: string
  convert?:
    | ((value: string, chain?: string) => Promise<string> | string | undefined)
    | null
}

export const NotificationRow: React.FC<{
  value: string
  type: string
  options: Option[]
}> = ({ value, type, options = [] }): ReactElement => {
  const selectOptionPlaceholder: ValueType<Option, false> = {
    convert: null,
    value: '',
    label: '',
  }
  const [selectedOption, setSelectedOption] = React.useState(
    selectOptionPlaceholder,
  )
  const [convertedValue, setConvertedvalue] = React.useState('')

  React.useEffect(() => {
    const convert = async (): Promise<string | void> => {
      if (selectedOption && selectedOption.convert) {
        const convertedValue = await selectedOption.convert(value, chain)
        convertedValue && setConvertedvalue(convertedValue)
      }
    }
    if (selectedOption) {
      convert()
    }
  }, [selectedOption, options, value, chain])

  const handleChange = (selectedOption: ValueType<Option, false>): void => {
    selectedOption && setSelectedOption(selectedOption as Option)
  }

  let filteredOptions: Option[] = []
  // indicative of an address
  if (type === 'ByteArray' && value.length === 40) {
    filteredOptions = [ADDRESS_OPTION, HEX_STRING_OPTION]
  }
  if (type === 'ByteArray' && value.length !== 40) {
    filteredOptions = [HEX_STRING_OPTION, STRING_OPTION]
  }

  return (
    <Select
      selectedOption={(selectedOption.label && selectedOption) || options[0]}
      handleChange={handleChange}
      options={filteredOptions || options}
      computedDisplayValue={convertedValue || value}
    />
  )
}

export const NotificationPanel: React.FC<{
  notification: TransactionNotification
  chain?: string
}> = ({ notification, chain }): ReactElement => {
  return (
    <div className="notification-panel">
      <div className="notification-panel-header">STATE</div>
      {notification.state.value.map((state, i) => (
        <div className="notification-state-row-container" key={i}>
          <span> [{i}] </span>
          <p
            style={{
              background:
                TX_STATE_TYPE_MAPPINGS[state.type] &&
                TX_STATE_TYPE_MAPPINGS[state.type].color,
            }}
          >
            {state.type}
          </p>
          {state.value &&
            TX_STATE_TYPE_MAPPINGS[state.type] &&
            TX_STATE_TYPE_MAPPINGS[state.type].options && (
              <NotificationRow
                value={state.value}
                type={state.type}
                options={TX_STATE_TYPE_MAPPINGS[state.type].options}
                chain={chain}
              />
            )}
        </div>
      ))}
    </div>
  )
}

const NotificationHeaderLink: React.FC<{
  notification: TransactionNotification
  chain: string
  network: string
}> = ({ notification, chain, network }): ReactElement => (
  <div className="NotificationHeaderLink">
    NOTIFICATIONS
    <Link to={`/contract/${chain}/${network}/${notification.contract}`}>
      {' '}
      {notification.contract}{' '}
    </Link>
  </div>
)

export const Notification: React.FC<{
  notification: TransactionNotification
  chain: string
  network: string
}> = ({ notification, chain, network }): ReactElement => {
  return (
    <div style={{ margin: '24px 0' }} className="Notification">
      <ExpandingPanel
        title={
          <NotificationHeaderLink
            chain={chain}
            network={network}
            notification={notification}
          />
        }
        open={false}
      >
        <div
          className="secondary-panels-row"
          style={{
            display: 'flex',
          }}
        >
          <NotificationPanel chain={chain} notification={notification} />
        </div>
      </ExpandingPanel>
    </div>
  )
}

export default Notification
