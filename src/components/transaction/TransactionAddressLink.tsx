import React from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants'
import { truncateHash } from '../../utils/formatter'

type Props = {
  address: string
  linkClassName?: string
  chain: string
  network: string
}

export const TransactionAddressLink: React.FC<Props> = ({
  address,
  linkClassName,
  chain,
  network,
}) => {
  const isAddress = address !== 'mint' && address !== 'burn'

  return isAddress ? (
    <Link
      className={linkClassName}
      to={`${ROUTES.WALLET.url}/${chain}/${network}/${address}`}
    >
      <span className="text-primary">{truncateHash(address, true, 25, 7)}</span>
    </Link>
  ) : (
    <span className="text">{address}</span>
  )
}
