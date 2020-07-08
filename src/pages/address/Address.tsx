import React, { useEffect } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import './Address.scss'
import { ROUTES } from '../../constants'
import {
  fetchAddress,
  fetchAddressTransferHistory,
} from '../../actions/addressActions'
import { State as AddressState } from '../../reducers/addressReducer'
import tokens from '../../assets/tokens'
import AddressTransactionsList from '../../components/address/AddressTransactionsList'

interface MatchParams {
  hash: string
}

type Props = RouteComponentProps<MatchParams>

const Address: React.FC<Props> = (props: Props) => {
  const { hash } = props.match.params
  const dispatch = useDispatch()
  const addressState = useSelector(
    ({ address }: { address: AddressState }) => address,
  )
  const { requestedAddress, balance, transferHistory, isLoading } = addressState

  useEffect(() => {
    dispatch(fetchAddress(hash))
    dispatch(fetchAddressTransferHistory(hash))
  }, [dispatch, hash])

  return (
    <div id="Address" className="page-container">
      <div className="inner-page-container">
        <div className="page-title-container">
          {ROUTES.WALLETS.renderIcon()}
          <h1>Address Information</h1>
        </div>

        <div id="address-hash-container">
          <label>ADDRESS</label> <span>{requestedAddress}</span>
        </div>

        {balance && !isLoading && (
          <>
            <div id="address-balance-container">
              <div id="balance-label">BALANCE</div>
              {balance &&
                balance.map(balance => (
                  <div key={balance.symbol} className="balance-container">
                    <div>
                      {tokens[balance.symbol] && (
                        <img src={tokens[balance.symbol]} alt="token-logo" />
                      )}{' '}
                      <span className="balance-symbol">{balance.symbol}</span>
                      {balance.name && (
                        <span className="balance-name">({balance.name})</span>
                      )}
                    </div>
                    <div className="balance-amount"> {balance.balance} </div>
                  </div>
                ))}
            </div>

            {transferHistory && !!transferHistory.length && (
              <AddressTransactionsList transactions={transferHistory || []} />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default withRouter(Address)
