import React, { useEffect } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

import './Address.scss'
import { ROUTES } from '../../constants'
import {
  fetchAddress,
  fetchAddressTransferHistory,
} from '../../actions/addressActions'
import { State as AddressState } from '../../reducers/addressReducer'
import tokens from '../../assets/nep5/svg'
import AddressTransactionsList from '../../components/address/AddressTransactionsList'
import useUpdateNetworkState from '../../hooks/useUpdateNetworkState'

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
  const {
    requestedAddress,
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
        <div className="page-title-container">
          {ROUTES.WALLETS.renderIcon()}
          <h1>Address Information</h1>
        </div>

        <div id="address-hash-container">
          <label>ADDRESS</label> <span>{hash}</span>
        </div>

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
                      {tokens[balance.symbol] && (
                        <img src={tokens[balance.symbol]} alt="token-logo" />
                      )}{' '}
                      <div className="balance-symbol">{balance.symbol}</div>
                      {balance.name && (
                        <div className="balance-name">({balance.name})</div>
                      )}
                    </div>
                    <div className="balance-amount"> {balance.balance} </div>
                  </div>
                ))}
            </div>

            {transferHistory && !!transferHistory.length && (
              <AddressTransactionsList
                transactions={transferHistory || []}
                shouldRenderLoadMore={transferHistory.length < totalCount}
                handleLoadMore={loadNextTransactionsPage}
                isLoading={transferHistoryLoading}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default withRouter(Address)
