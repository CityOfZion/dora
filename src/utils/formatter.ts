export const convertToArbitraryDecimals = (
  num: number,
  decimals: number,
): number => {
  const multiplier = 1 / Math.pow(10, decimals)
  return num * multiplier
}
