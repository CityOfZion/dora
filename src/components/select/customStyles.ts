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
  }),

  control: (provided: CSSProperties, state: SelectState): CSSProperties => ({
    ...provided,
    backgroundColor: '#2F454E',
    border: 'transparent',
    borderRadius: '0 80px 80px 0',
    height: '30px',
    minHeight: '30px',
    paddingLeft: '12px',

    boxShadow: state.isFocused ? '0' : '0',

    // eslint-disable-next-line
    // @ts-ignore
    '&:hover': {
      border: state.isFocused ? '0' : '0',
    },

    // backgroundColor: state.isFocused ? '#000033' : 'transparent',
    // display: 'flex',
    // border: state.isFocused
    //   ? 'solid 1px var(--text-color-secondary)'
    //   : 'solid 1px transparent',
    // borderRadius: state.isFocused ? '3px 3px 0 0' : '3px',
    // minHeight: '32px',
    // opacity: state.isDisabled ? 0.4 : 1,

    //  '&:hover': {
    //    border: 'solid 1px var(--text-color-secondary)',
    //  },
    // boxShadow: 'none',
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
    provided: CSSProperties,
    state: SelectState,
  ): CSSProperties => ({
    ...provided,
    color: '#cae0eb',
    opacity: state.isDisabled ? 0.3 : 1,
  }),
  option: (provided: CSSProperties, state: SelectState): CSSProperties => ({
    ...provided,
    color: '#cae0eb',
    backgroundColor:
      state.isFocused || state.isSelected ? '#2F454E' : '#2F454E',
    // padding: '4px 8px',
    // margin: '6px 0',
    // eslint-disable-next-line
    // @ts-ignore
    '&:active': {
      color: '#cae0eb',
      background: 'transparent',
      // color: '#000033',
    },
  }),
}
