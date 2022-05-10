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

export const truncateHash = (
  text?: string,
  isMobile = false,
  minTextLength = 25,
  firstChars?: number,
) => {
  if (text) {
    if (isMobile && text.length > minTextLength) {
      const separator = '...'
      const firstHalf = text.substring(
        0,
        Math.floor(firstChars || text.length / 2),
      )
      const lastDigits = text.substring(text.length - 4, text.length)
      return firstHalf + separator + lastDigits
    } else {
      return text
    }
  } else {
    return ''
  }
}

export const capitalizeWord = (word: string) => {
  const firstLetter = word.charAt(0).toUpperCase()
  return firstLetter + word.slice(1)
}

export const uuid = () => {
  const date = Date.now().toString(36)
  const numbers = Math.random().toString(36)
  return date + numbers
}
