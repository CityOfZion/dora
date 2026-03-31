import { memo, useState } from 'react'
import './TokenIcon.scss'

const NEON_ICONS_URL =
  'https://raw.githubusercontent.com/CityOfZion/neon-icons/main/tokens'

type Props = {
  blockchain: string
  hash: string
  symbol?: string
  className?: string
  notFoundElement?: JSX.Element
}

export const TokenIcon = memo(
  ({ blockchain, hash, symbol, className, notFoundElement }: Props) => {
    const [hasError, setHasError] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)

    return hasError && notFoundElement ? (
      notFoundElement
    ) : (
      <img
        src={`${NEON_ICONS_URL}/${blockchain}/${hash}.png`}
        alt={symbol ? `${symbol} logo` : 'Token logo'}
        className={`token-icon ${className}`}
        style={{ display: isLoaded ? 'block' : 'none' }}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
    )
  },
)
