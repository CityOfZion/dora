import tokens from '../assets/nep5/svg'

export const getLogo = (symbol: string, chain: string) => {
  const isNeo2 = ['NEO', 'GAS'].includes(symbol) && chain === 'neo2'
  const tidySymbol = isNeo2 ? `${symbol}2` : symbol

  const icon = tokens[tidySymbol]

  return icon || undefined
}
