import React from 'react'
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom'
import { ROUTES } from '../../../constants'
import Copy from '../../../components/copy/Copy'
import classNames from 'classnames'
import { getLogo } from '../../../utils/getLogo'
import { capitalizeWord } from '../../../utils/formatter'

interface MatchParams {
  hash: string
  chain: string
  network: string
}

type Props = RouteComponentProps<MatchParams>

const AddressHeader: React.FC<Props> = (props: Props) => {
  const { hash, chain, network } = props.match.params

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
              <img src={getLogo('NEO', chain)} alt="token-logo" />
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

export default withRouter(AddressHeader)
