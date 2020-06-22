import React, { useEffect } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'

import { State as AddressState } from '../../reducers/addressReducer'
import './Transaction.scss'
import { ROUTES } from '../../constants'
import { fetchTransaction } from '../../actions/transactionActions'

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
  const { requestedAddress, isLoading } = addressState

  useEffect(() => {
    dispatch(fetchTransaction(hash))
  }, [dispatch, hash])

  return (
    <div id="Address" className="page-container">
      <div className="inner-page-container">
        <div className="page-title-container">
          {ROUTES.WALLETS.renderIcon()}
          <h1>Address Information</h1>
        </div>

        {/* <div id="transaction-details-container">
          <div className="details-section">
            <div className="section-label">DETAILS</div>
            <div className="inner-details-container">
              <div className="detail-tile-row">
                <div className="detail-tile">
                  <label>TYPE</label>
                  <span>{!isLoading && transaction && transaction.type}</span>
                </div>

                <div className="detail-tile">
                  <label>SIZE</label>
                  <span>
                    {!isLoading &&
                      transaction &&
                      transaction.size.toLocaleString()}{' '}
                    bytes
                  </span>
                </div>
              </div>

              <div className="detail-tile-row">
                <div className="detail-tile">
                  <label>INCLUDED IN BLOCK</label>
                  <span>
                    {!isLoading &&
                      transaction &&
                      transaction.block.toLocaleString()}
                  </span>
                </div>

                <div className="detail-tile">
                  <label>TIME</label>
                  <span id="time-details-row">
                    <div>
                      {!isLoading && transaction && (
                        <>
                          <Calendar />
                          {moment.unix(transaction.time).format('MM-DD-YYYY')}
                        </>
                      )}
                    </div>
                    <div>
                      {!isLoading && transaction && (
                        <>
                          <Clock />
                          {moment.unix(transaction.time).format('HH:MM:SS')}
                        </>
                      )}
                    </div>
                  </span>
                </div>
              </div>

              <div id="transaction-hash-tile" className="detail-tile">
                <label>HASH</label>
                <span>{!isLoading && transaction && transaction.txid}</span>
              </div>

              {transaction && transaction.scripts[0] && (
                <ExpandingPanel title="RAW SCRIPT" open={false}>
                  <div className="script-tile-row">
                    <div className="detail-tile script-tile">
                      <label>INVOCATION SCRIPT</label>
                      <span>
                        {!isLoading &&
                          transaction &&
                          transaction.scripts[0].invocation}{' '}
                      </span>
                    </div>
                    <div className="detail-tile script-tile">
                      <label>VERIFICATION SCRIPT</label>
                      <span>
                        {!isLoading &&
                          transaction &&
                          transaction.scripts[0].verification}{' '}
                      </span>
                    </div>
                  </div>
                </ExpandingPanel>
              )}
            </div>
          </div> */}
      </div>
    </div>
  )
}

export default withRouter(Address)
