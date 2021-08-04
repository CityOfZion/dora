import React, { ReactElement } from 'react'
import Select from '../select/Select'
import { ValueType } from 'react-select'
import './ToggleDropdown.scss'
import { Platform } from '../filter/Filter'

export type Option = {
  value: Platform | string
  label: string
}

export const ToggleDropdown: React.FC<{
  disabled: boolean
  options: Option[]
  handleChange(options: ValueType<Option, false>): void
  selectedOption: Option
}> = ({ disabled, options, handleChange, selectedOption }): ReactElement => {
  return (
    <div id="ToggleDropdown">
      <Select
        selectedOption={selectedOption}
        handleChange={handleChange}
        options={options}
        disabled={disabled}
      />
    </div>
  )
}

export default ToggleDropdown
