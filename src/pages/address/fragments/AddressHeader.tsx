import React from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { N3_NEO_TOKEN_HASH, ROUTES } from '../../../constants'
import Copy from '../../../components/copy/Copy'
import classNames from 'classnames'
import { capitalizeWord } from '../../../utils/formatter'
import { TokenIcon } from '../../../components/token-icon/TokenIcon'

interface MatchParams extends Record<string, string | undefined> {
  hash: string
  chain: string
  network: string
}

const AddressHeader: React.FC = () => {
  const { hash = '', chain = '', network = '' } = useParams<MatchParams>()

  return (
    <>
      <div className="page-title-container">
        {ROUTES.WALLETS.renderIcon()}
        <h1>Address Information</h1>
      </div>

      <div id="address-hash-container">
        <label>ADDRESS</label>
        <div className="horiz weight-1">
          <div className="address-hash-info">
            <div className="address-hash-logo">
              <TokenIcon
                blockchain={chain}
                symbol={'NEO'}
                hash={N3_NEO_TOKEN_HASH}
                className="icon"
              />
            </div>
            <div>
              <div>{`Neo N3 (${capitalizeWord(network)})`}</div>
              <div className="hash-label">{hash}</div>
            </div>
          </div>
          <Copy text={hash} />
        </div>
      </div>

      <div id="address-menu" className={chain}>
        <NavLink
          to={`${ROUTES.WALLET.url}/${chain}/${network}/${hash}/assets`}
          className={classNames({
            option: true,
          })}
        >
          Assets
        </NavLink>
        {chain === 'neo3' && (
          <>
            <NavLink
              to={`${ROUTES.WALLET.url}/${chain}/${network}/${hash}/nfts`}
              className={classNames({
                option: true,
              })}
            >
              NFTs
            </NavLink>

            <NavLink
              to={`${ROUTES.WALLET.url}/${chain}/${network}/${hash}/transactions`}
              className={classNames({
                option: true,
              })}
            >
              Transactions
            </NavLink>
          </>
        )}
      </div>
    </>
  )
}

export default AddressHeader
