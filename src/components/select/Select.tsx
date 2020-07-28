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
  handleChange: (selected: ValueType<SelectOption>) => void
  selectedOption: SelectOption
}

const CustomSelect: React.FC<SelectProps> = ({
  selectedOption,
  handleChange,
  options,
  computedDisplayValue,
}): ReactElement => (
  <div className="select-container">
    <div className="inner-select-container">
      <Select
        value={selectedOption}
        onChange={handleChange}
        options={options}
        isSearchable={false}
        styles={customStyles}
        autosize={false}
        classNamePrefix="react-select"
        isDisabled={!options.length || options.length === 1}
      />
    </div>
    <div className="select-computed-value">{computedDisplayValue}</div>
  </div>
)

export default CustomSelect
