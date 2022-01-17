import React, { useEffect, useState } from 'react'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import { ROUTES } from '../../../constants'
import Copy from '../../../components/copy/Copy'
import GAS2 from '../../../assets/icons/GAS_2.svg'
import GAS3 from '../../../assets/icons/GAS_3.svg'
import Neo2 from '../../../assets/icons/neo2.svg'
import Neo3 from '../../../assets/icons/neo3.svg'
import tokens from '../../../assets/nep5/svg'
import useUpdateNetworkState from '../../../hooks/useUpdateNetworkState'
import classNames from 'classnames'

function returnTransferLogo(
  name: string,
  chain: string,
): React.ReactNode | string {
  if (name === 'GAS') {
    return chain === 'neo2' ? (
      <img src={GAS2} alt="token-logo" />
    ) : (
      <img src={GAS3} alt="token-logo" />
    )
  }

  if (name === 'NEO') {
    return chain === 'neo2' ? (
      <img src={Neo2} alt="token-logo" />
    ) : (
      <img src={Neo3} alt="token-logo" />
    )
  }

  return tokens[name] && <img src={tokens[name]} alt="token-logo" />
}

interface MatchParams {
  hash: string
  chain: string
  network: string
}

type Props = RouteComponentProps<MatchParams>

const AddressHeader: React.FC<Props> = (props: Props) => {
  useUpdateNetworkState(props)
  const { hash, chain, network } = props.match.params
  const { pathname } = props.location

  const [selectedOption, setSelectedOption] = useState('')

  useEffect(() => {
    const path = pathname.split('/')
    setSelectedOption(path[5] || 'assets')
  }, [pathname])

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
              {returnTransferLogo('NEO', chain)}
            </div>
            <div>
              <div>{chain === 'neo2' ? 'Neo Legacy' : 'Neo N3'}</div>
              <div className="hash-label">{hash}</div>
            </div>
          </div>
          <Copy text={hash} />
        </div>
      </div>

      <div id="address-menu">
        <Link
          to={`${ROUTES.WALLET.url}/${chain}/${network}/${hash}`}
          className={classNames({
            active: selectedOption === 'assets',
          })}
        >
          Assets
        </Link>
        {chain === 'neo3' && (
          <Link
            to={`${ROUTES.WALLET.url}/${chain}/${network}/${hash}/nfts`}
            className={classNames({
              active: selectedOption === 'nfts',
            })}
          >
            NFTs
          </Link>
        )}
        <Link
          to={`${ROUTES.WALLET.url}/${chain}/${network}/${hash}/transactions`}
          className={classNames({
            active: selectedOption === 'transactions',
          })}
        >
          Transactions
        </Link>
      </div>
    </>
  )
}

export default withRouter(AddressHeader)
