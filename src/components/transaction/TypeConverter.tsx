import { Platform } from '../filter/Filter'
import React, { ReactElement } from 'react'
import { SingleValue } from 'react-select'
import {
  ADDRESS_OPTION,
  BYTE_STRING_OPTION,
  HEX_STRING_OPTION,
  STRING_OPTION,
} from '../../constants'
import Select from '../select/Select'

type Option = {
  value: Platform | string
  label: string
  convert?:
    | ((value: string, chain?: string) => Promise<string> | string | undefined)
    | null
}

export const TypeConverter: React.FC<{
  value: string
  type: string
  options: Option[]
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  handleValue?: Function
  chain?: string
}> = ({ value, type, options = [], chain, handleValue }): ReactElement => {
  const selectOptionPlaceholder: SingleValue<Option> = {
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
        const _convertedValue = await selectedOption.convert(value, chain)
        if (_convertedValue) {
          setConvertedvalue(_convertedValue)
        }

        if (!convertedValue && handleValue) {
          handleValue(_convertedValue)
        }
      }
    }
    if (selectedOption) {
      convert()
      if (
        selectedOption.label === HEX_STRING_OPTION.label ||
        selectedOption.label === STRING_OPTION.label
      ) {
        setConvertedvalue(value)
      }
    }
  }, [selectedOption, options, value, chain])

  const handleChange = (selectedOption: SingleValue<Option>): void => {
    if (selectedOption) {
      setSelectedOption(selectedOption as Option)
    }

    if (handleValue) {
      handleValue(
        selectedOption?.label === STRING_OPTION.label ? convertedValue : value,
      )
    }
  }

  let filteredOptions: Option[] = []
  // indicative of an address
  if (type === 'ByteArray' && value.length === 40) {
    filteredOptions = [ADDRESS_OPTION, HEX_STRING_OPTION]
  }
  if (type === 'ByteArray' && value.length !== 40) {
    filteredOptions = [HEX_STRING_OPTION, STRING_OPTION]
  }

  if (type === 'ByteString' && value.length !== 28) {
    filteredOptions = [BYTE_STRING_OPTION]
  }

  return (
    <Select
      showSelected={false}
      selectedOption={(selectedOption.label && selectedOption) || options[0]}
      handleChange={handleChange}
      options={(filteredOptions.length && filteredOptions) || options}
      computedDisplayValue={
        selectedOption.label === STRING_OPTION.label ? convertedValue : value
      }
    />
  )
}
