import React, { ReactElement } from 'react'
import Select, { ValueType } from 'react-select'

import './Select.scss'
import { customStyles } from './customStyles'

type SelectOption = {
  label: string
  value: string
}

type SelectProps = {
  computedDisplayValue?: string
  options: SelectOption[]
  handleChange?: (selected: ValueType<SelectOption, false>) => void
  selectedOption: SelectOption
  disabled?: boolean
}

const CustomSelect: React.FC<SelectProps> = ({
  selectedOption,
  handleChange,
  options,
  computedDisplayValue,
  disabled,
}): ReactElement => (
  <div className="select-container">
    <div className="inner-select-container">
      <Select
        value={selectedOption}
        onChange={handleChange}
        options={options}
        isSearchable={false}
        // eslint-disable-next-line
        // @ts-ignore
        styles={customStyles}
        autosize={false}
        classNamePrefix="react-select"
        isDisabled={!options.length || options.length === 1 || disabled}
      />
    </div>
    <div className="select-computed-value">{computedDisplayValue}</div>
  </div>
)

export default CustomSelect
