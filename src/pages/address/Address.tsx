import React, { useEffect } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

import './Address.scss'
import { fetchAddress } from '../../actions/addressActions'
import { State as AddressState } from '../../reducers/addressReducer'
import tokens from '../../assets/nep5/svg'
import useUpdateNetworkState from '../../hooks/useUpdateNetworkState'
import { toBigNumber } from '../../utils/formatter'
import AddressHeader from './fragments/AddressHeader'

function getTransferLogo(symbol: string, chain: string): React.ReactNode {
  const tidySymbol =
    symbol === 'GAS' || symbol === 'NEO'
      ? chain === 'neo2'
        ? `symbol${2}`
        : symbol
      : symbol

  const icon = tokens[tidySymbol]

  return icon ? (
    <img src={icon} className="icon" alt="token-logo" />
  ) : (
    <span className="icon-not-found">N/A</span>
  )
}

interface MatchParams {
  hash: string
  chain: string
  network: string
}

type Props = RouteComponentProps<MatchParams>

const Address: React.FC<Props> = (props: Props) => {
  useUpdateNetworkState(props)
  const { hash, chain } = props.match.params
  const dispatch = useDispatch()
  const addressState = useSelector(
    ({ address }: { address: AddressState }) => address,
  )
  const { balance, isLoading } = addressState

  useEffect(() => {
    dispatch(fetchAddress(hash, chain))
  }, [chain, dispatch, hash])

  return (
    <div id="Address" className="page-container">
      <div className="inner-page-container">
        <AddressHeader {...props} />

        {isLoading && (
          <div id="address-balance-container">
            <SkeletonTheme
              color="#21383d"
              highlightColor="rgb(125 159 177 / 25%)"
            >
              <Skeleton count={5} />{' '}
            </SkeletonTheme>
          </div>
        )}

        {balance && !isLoading && (
          <>
            <div id="address-balance-container">
              {balance &&
                balance.map(balance => (
                  <div key={balance.symbol} className="balance-container">
                    <div className="balance-details">
                      <div className="icon-container">
                        {getTransferLogo(balance.symbol, chain)}
                      </div>
                      <div className="balance-infos">
                        <span className="balance-symbol">{balance.symbol}</span>
                        {balance.name && (
                          <span className="balance-name">{balance.name}</span>
                        )}
                      </div>
                    </div>
                    <div className="balance-amount">
                      {toBigNumber(balance.balance).toString()}
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default withRouter(Address)
