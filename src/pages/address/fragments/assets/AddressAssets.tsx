import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RouteComponentProps, withRouter, useHistory } from 'react-router-dom'

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { toBigNumber } from '../../../../utils/formatter'
import { State as AddressState } from '../../../../reducers/addressReducer'
import {
  fetchAddress,
  resetAddressState,
} from '../../../../actions/addressActions'
import useUpdateNetworkState from '../../../../hooks/useUpdateNetworkState'
import { getLogo } from '../../../../utils/getLogo'

function getTransferLogo(symbol: string, chain: string): React.ReactNode {
  const icon = getLogo(symbol, chain)

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

const AddressAssets: React.FC<Props> = props => {
  const { hash, chain, network } = props.match.params
  useUpdateNetworkState(props)
  const dispatch = useDispatch()
  const addressState = useSelector(
    ({ address }: { address: AddressState }) => address,
  )
  const { balance, isLoading } = addressState

  const history = useHistory()
  function handleContractClick(contractHash: string) {
    history.push(`/contract/${chain}/${network}/${contractHash}`)
  }

  useEffect(() => {
    dispatch(fetchAddress(hash, chain))

    return () => {
      dispatch(resetAddressState())
    }
  }, [chain, dispatch, hash])

  return (
    <div id="nft-container" className="page-container">
      <div id="address-balance-container">
        {balance &&
          balance.map(balance => (
            <div key={balance.symbol} className="balance-container">
              <div className="balance-details">
                <div className="icon-container">
                  {getTransferLogo(balance.symbol, chain)}
                </div>
                <div
                  className="balance-infos"
                  onClick={() => handleContractClick(balance.asset)}
                >
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
    </div>
  )
}

export default withRouter(AddressAssets)
