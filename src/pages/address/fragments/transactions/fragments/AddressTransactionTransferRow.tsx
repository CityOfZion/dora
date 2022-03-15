import React from 'react'
import { Transfer } from '../AddressTransaction'
import { ROUTES } from '../../../../../constants'
import { Link } from 'react-router-dom'
import tokens from '../../../../../assets/nep5/svg'
import { truncateHash } from '../../../../../utils/formatter'

type Props = {
  transfers: Transfer[]
  chain: string
  network: string
}

const AddressTransactionTransfer: React.FC<Props> = (props: Props) => {
  const { transfers, chain, network } = props

  return (
    <div className="address-transactions__table--transfers-items">
      {transfers.length > 0 && (
        <>
          <div className="address-transactions__table--transfers-labels">
            <label>From</label>
            <label>To</label>
            <label>Symbol</label>
            <label>Amount</label>
            <label>Type</label>
          </div>

          {transfers.map(transfer => (
            <div
              className="address-transactions__table--transfers-values"
              key={transfer.from + transfer.to + transfer.amount}
            >
              <Link
                to={`${ROUTES.WALLET.url}/${chain}/${network}/${transfer.from}`}
              >
                <span className="text-primary">
                  {truncateHash(transfer.from, true, 25, 7)}
                </span>
              </Link>
              <Link
                className="hash"
                to={`${ROUTES.WALLET.url}/${chain}/${network}/${transfer.to}`}
              >
                <span className="text-primary">
                  {truncateHash(transfer.to, true, 25, 7)}
                </span>
              </Link>
              <span className="whitespace-no-wrap">
                {truncateHash(transfer.symbol, true, 10, 4)}
              </span>
              <span className="whitespace-no-wrap">
                {tokens[transfer.symbol ?? 'NEO'] && (
                  <img
                    width={15}
                    height={10}
                    src={tokens[transfer.symbol ?? 'NEO']}
                    alt=""
                  />
                )}
                {transfer.amount}
              </span>
              <span>NEP-17 Transfer</span>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

export default AddressTransactionTransfer
