import React, { useEffect, useState } from 'react'
import { RouteComponentProps, useHistory, withRouter } from 'react-router-dom'
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

type Props = RouteComponentProps<MatchParams> & {
  onChange: Function
}

const AddressHeader: React.FC<Props> = (props: Props) => {
  const { hash, chain, network } = props.match.params
  const { pathname } = props.location
  const history = useHistory()
  useUpdateNetworkState(props)

  const [selectedOption, setSelectedOption] = useState('')

  const changeRoute = (val: string) => {
    setSelectedOption(val)
    props.onChange(val)
    const path = `${ROUTES.WALLET.url}/${chain}/${network}/${hash}/${val}`

    history.push(path)
  }

  useEffect(() => {
    const path = pathname.split('/')
    changeRoute(path[5] || 'assets')
  }, [])

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
        <div
          onClick={() => changeRoute('assets')}
          className={classNames({
            option: true,
            active: selectedOption === 'assets',
          })}
        >
          Assets
        </div>
        {chain === 'neo3' && (
          <div
            onClick={() => changeRoute('nfts')}
            className={classNames({
              option: true,
              active: selectedOption === 'nfts',
            })}
          >
            NFTs
          </div>
        )}
        <div
          onClick={() => changeRoute('transactions')}
          className={classNames({
            option: true,
            active: selectedOption === 'transactions',
          })}
        >
          Transactions
        </div>
      </div>
    </>
  )
}

export default withRouter(AddressHeader)
