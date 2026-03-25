import React from 'react'

const NEON_ICONS_URL =
  'https://raw.githubusercontent.com/CityOfZion/neon-icons/main/tokens'

type Props = {
  blockchain: string
  hash: string
  width?: number
  height?: number
  className?: string
}

export const TokenIcon = React.memo(
  ({ blockchain, hash, width = 24, height = 24, className }: Props) => {
    return (
      <img
        src={`${NEON_ICONS_URL}/${blockchain}/${hash}.png`}
        alt="token-logo"
        width={width}
        height={height}
        className={className}
        style={{ display: 'none' }}
        onLoad={({ currentTarget }) => {
          currentTarget.style.display = 'block'
        }}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null
        }}
      />
    )
  },
)
