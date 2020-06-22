import React, { useEffect, useState } from 'react'
import { RouteComponentProps, withRouter, useHistory } from 'react-router-dom'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import get from 'lodash/get'
import NeoConvertor from 'neo-convertor'

import {
  State as TransactionState,
  DetailedTransaction,
} from '../../reducers/transactionReducer'
import './Transaction.scss'
import { ROUTES, TRANSFER, GENERATE_BASE_URL } from '../../constants'
import { ReactComponent as Calendar } from '../../assets/icons/calendar.svg'
import { ReactComponent as Clock } from '../../assets/icons/clock.svg'
import { fetchTransaction } from '../../actions/transactionActions'
import ExpandingPanel from '../../components/panel/ExpandingPanel'
import Transfer from '../../components/transfer/Transfer'

type ParsedTransfer = { name: string; amount: string; to: string; from: string }

const generateTransfersArr = async (
  transaction: DetailedTransaction,
): Promise<ParsedTransfer[]> => {
  const transfers = []
  if (transaction) {
    for (const notification of transaction.Item.notifications) {
      if (notification.state.type === 'Array') {
        let isTransfer = false
        notification.state.value.forEach(value => {
          if (value.value === TRANSFER) {
            isTransfer = true
          }
        })
        if (isTransfer) {
          // TODO: check if the contract is NEO or GAS to avoid making this request
          const response = await fetch(
            `${GENERATE_BASE_URL()}/get_asset/${notification.contract}`,
          )
          const json = await response.json()

          console.log(NeoConvertor.StringHex.stringToHex('transfer'))

          const name = json.name

          const integerNotfication = notification.state.value.find(
            value => value.type === 'Integer',
          )
          const amount = integerNotfication ? integerNotfication.value : '0'

          const from = await NeoConvertor.Address.scriptHashToAddress(
            get(notification, 'state.value[1].value', ''),
            true,
          )

          const to = get(notification, 'state.value[2].value', '')

          transfers.push({
            name,
            amount,
            to,
            from,
          })
        }
      }
    }
  }
  return transfers
}

interface MatchParams {
  hash: string
}

type Props = RouteComponentProps<MatchParams>

const Transaction: React.FC<Props> = (props: Props) => {
  const { hash } = props.match.params
  const dispatch = useDispatch()
  const history = useHistory()

  const transferArr: ParsedTransfer[] = []
  const [transfers, setTransfers] = useState(transferArr)

  const transactionState = useSelector(
    ({ transaction }: { transaction: TransactionState }) => transaction,
  )
  const { transaction, isLoading } = transactionState

  useEffect(() => {
    async function computeTransfers(): Promise<void> {
      if (transaction && transaction.Item && transaction.Item.notifications) {
        const transfers = await generateTransfersArr(transaction)
        setTransfers(transfers)
      }
    }
    dispatch(fetchTransaction(hash))
    computeTransfers()
  }, [dispatch, hash, transaction])

  console.log(transfers)

  return (
    <div id="Transaction" className="page-container">
      <div className="inner-page-container">
        <div className="page-title-container">
          {ROUTES.TRANSACTIONS.renderIcon()}
          <h1>Transaction Information</h1>
        </div>
        {!!transfers.length && (
          <Transfer
            transfers={transfers}
            handleAddressClick={(address): void =>
              history.push(`/address/${address}`)
            }
          />
        )}

        <div id="transaction-details-container">
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default withRouter(Transaction)
