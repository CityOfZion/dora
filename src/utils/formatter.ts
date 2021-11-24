import BigNumber from 'bignumber.js'

export const convertToArbitraryDecimals = (
  num: number,
  decimals: number,
): number => {
  const multiplier = Math.pow(10, decimals)
  return num / multiplier
}

BigNumber.config({ EXPONENTIAL_AT: 12 })

// https://github.com/MikeMcl/bignumber.js/issues/11
export const toBigNumber = (value: number | string) =>
  new BigNumber(String(value))
