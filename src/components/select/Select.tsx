import React, { ReactElement } from 'react'
import Select, { ValueType } from 'react-select'

import './Select.scss'
import { customStyles } from './customStyles'
import { Option } from '../filter/Filter'

type SelectProps = {
  computedDisplayValue?: string
  options: Option[]
  handleChange?: (selected: ValueType<Option, false>) => void
  selectedOption: Option
  disabled?: boolean
  showSelected?: boolean
}

const CustomSelect: React.FC<SelectProps> = ({
  selectedOption,
  handleChange,
  options,
  computedDisplayValue,
  disabled,
  showSelected = true,
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
    {showSelected && (
      <div className="select-computed-value">{computedDisplayValue}</div>
    )}
  </div>
)

export default CustomSelect
