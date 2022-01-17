import React, { useEffect } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

import './Address.scss'
import {
  fetchAddress,
  fetchAddressTransferHistory,
} from '../../actions/addressActions'
import { State as AddressState } from '../../reducers/addressReducer'
import tokens from '../../assets/nep5/svg'
import AddressTransactionsList from '../../components/address/AddressTransactionsList'
import useUpdateNetworkState from '../../hooks/useUpdateNetworkState'
import Neo2 from '../../assets/icons/neo2.svg'
import Neo3 from '../../assets/icons/neo3.svg'
import GAS2 from '../../assets/icons/GAS_2.svg'
import GAS3 from '../../assets/icons/GAS_3.svg'
import { toBigNumber } from '../../utils/formatter'
import AddressHeader from './fragments/AddressHeader'

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

const Address: React.FC<Props> = (props: Props) => {
  useUpdateNetworkState(props)
  const { hash, chain, network } = props.match.params
  const dispatch = useDispatch()
  const addressState = useSelector(
    ({ address }: { address: AddressState }) => address,
  )
  const {
    balance,
    transferHistory,
    isLoading,
    totalCount,
    transferHistoryPage,
    transferHistoryLoading,
  } = addressState

  useEffect(() => {
    dispatch(fetchAddress(hash, chain))
    dispatch(fetchAddressTransferHistory(hash))
  }, [chain, dispatch, hash])

  const loadNextTransactionsPage = (): void => {
    dispatch(fetchAddressTransferHistory(hash, transferHistoryPage + 1))
  }

  return (
    <div id="Address" className="page-container">
      <div className="inner-page-container">
        <AddressHeader {...props} />

        {isLoading && (
          <div id="address-balance-container">
            <div id="balance-label">BALANCE</div>{' '}
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
              <div id="balance-label">BALANCE</div>
              {balance &&
                balance.map(balance => (
                  <div key={balance.symbol} className="balance-container">
                    <div className="balance-details">
                      {returnTransferLogo(balance.symbol, chain)}
                      <div className="balance-symbol">{balance.symbol}</div>
                      {balance.name && (
                        <div className="balance-name">({balance.name})</div>
                      )}
                    </div>
                    <div className="balance-amount">
                      {' '}
                      {toBigNumber(balance.balance).toString()}{' '}
                    </div>
                  </div>
                ))}
            </div>

            {transferHistory && !!transferHistory.length && (
              <AddressTransactionsList
                transactions={transferHistory || []}
                shouldRenderLoadMore={transferHistory.length < totalCount}
                handleLoadMore={loadNextTransactionsPage}
                isLoading={transferHistoryLoading}
                networkData={{ chain, network }}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default withRouter(Address)
