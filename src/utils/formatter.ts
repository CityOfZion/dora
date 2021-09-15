export const convertToArbitraryDecimals = (
  num: number,
  decimals: number,
): number => {
  const multiplier = Math.pow(10, decimals)
  return num / multiplier
}
