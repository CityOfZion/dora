import { CSSProperties } from 'react'

type SelectState = {
  isFocused: boolean
  isDisabled: boolean
  isSelected: boolean
}

export const customStyles = {
  boxShadow: 'none',
  indicatorSeparator: (): CSSProperties => ({
    display: 'none',
  }),
  indicatorsContainer: (): CSSProperties => ({
    background: '#D355E7',
    borderRadius: '0 80px 80px 0',
    maxWidth: '26.92px',
    width: '26.92px',
  }),
  valueContainer: (): CSSProperties => ({
    backgroundColor: '#2F454E',
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    paddingRight: '6px',
  }),
  control: (provided: CSSProperties, state: SelectState): CSSProperties => ({
    ...provided,
    backgroundColor: '#2F454E',
    border: 'transparent',
    borderRadius: '80px 80px',
    height: '30px',
    minHeight: '30px',
    paddingLeft: '12px',
    boxShadow: state.isFocused ? '0' : '0',
    zIndex: 100,
    flexWrap: 'nowrap',
    // eslint-disable-next-line
    // @ts-ignore
    '&:hover': {
      border: state.isFocused ? '0' : '0',
    },
  }),
  container: (provided: CSSProperties, state: SelectState): CSSProperties => ({
    ...provided,
    border: 'none',
    height: '30px',
    borderRadius: '0 80px 80px 0',
  }),
  menu: (provided: CSSProperties): CSSProperties => ({
    ...provided,
    border: 'none',
    backgroundColor: '#2F454E',
    borderColor: 'transparent',
    borderRadius: 0,
    marginTop: '1px',
    boxShadow: '0',
  }),
  singleValue: (
    _provided: CSSProperties,
    state: SelectState,
  ): CSSProperties => ({
    color: '#cae0eb',
    opacity: state.isDisabled ? 0.3 : 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }),
  option: (provided: CSSProperties, state: SelectState): CSSProperties => ({
    ...provided,
    color: '#cae0eb',
    backgroundColor:
      state.isFocused || state.isSelected ? '#2F454E' : '#2F454E',
    // eslint-disable-next-line
    // @ts-ignore
    '&:active': {
      color: '#cae0eb',
      background: 'transparent',
    },
  }),
}
