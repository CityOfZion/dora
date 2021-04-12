import React, { useEffect, useState, ReactElement } from 'react'
import { RouteComponentProps, withRouter, useHistory } from 'react-router-dom'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { Icon } from '@iconify/react'
import DateRangeIcon from '@material-ui/icons/DateRange'
import clockIcon from '@iconify/icons-simple-line-icons/clock'
import { uniqueId } from 'lodash'

import { formatDate, formatHours } from '../../utils/time'
import {
  State as TransactionState,
  DetailedTransaction,
} from '../../reducers/transactionReducer'
import './Transaction.scss'
import {
  ROUTES,
  GENERATE_BASE_URL,
  NEO_HASHES,
  GAS_HASHES,
  neo3_getAddressFromSriptHash,
} from '../../constants'
import { fetchTransaction } from '../../actions/transactionActions'
import ExpandingPanel from '../../components/panel/ExpandingPanel'
import Transfer from '../../components/transfer/Transfer'
import { disassemble } from '../../utils/disassemble'
import { convertToArbitraryDecimals } from '../../utils/formatter'
import Breadcrumbs from '../../components/navigation/Breadcrumbs'
import BackButton from '../../components/navigation/BackButton'
import Notification from '../../components/notification/Notification'
import useUpdateNetworkState from '../../hooks/useUpdateNetworkState'
import { neo3Disassemble } from '../../utils/neo3-disassemble'

type ParsedTransfer = {
  name: string
  amount: string | number
  to: string
  from: string
  symbol: string
}

const parseAbstractData = async (
  transaction: DetailedTransaction,
): Promise<ParsedTransfer[]> => {
  const transfers: ParsedTransfer[] = []

  if (transaction.items) {
    transaction.items.inputs.forEach(({ address, value, asset }) => {
      let name = ''
      if (NEO_HASHES.includes(asset)) {
        name = 'NEO'
      } else if (GAS_HASHES.includes(asset)) {
        name = 'GAS'
      }

      transfers.push({
        name,
        amount: value,
        to: '',
        from: address,
        symbol: name,
      })
    })

    transaction.items.outputs.forEach(({ address, value, asset }) => {
      let name = ''
      if (NEO_HASHES.includes(asset)) {
        name = 'NEO'
      } else if (GAS_HASHES.includes(asset)) {
        name = 'GAS'
      }

      transfers.push({
        name,
        amount: value,
        to: address,
        from: '',
        symbol: name,
      })
    })

    for (const token of transaction.items.tokens) {
      const { scripthash, amount, to, from } = token
      const response = await fetch(`${GENERATE_BASE_URL()}/asset/${scripthash}`)
      const json = await response.json()
      const { name, symbol } = json

      const amountWithDecimals = convertToArbitraryDecimals(
        Number(amount),
        json.decimals,
      )

      transfers.push({
        name,
        amount: amountWithDecimals,
        to,
        from,
        symbol,
      })
    }
  }

  return transfers
}

const parseNeo3TransactionData = async (
  transaction: DetailedTransaction,
): Promise<ParsedTransfer[]> => {
  const transfers: ParsedTransfer[] = []

  if (transaction && transaction.notifications) {
    for (const notification of transaction.notifications) {
      if (notification.state.type === 'Array') {
        const isTransfer = notification.event_name === 'Transfer'

        if (isTransfer) {
          const assetResponse = await fetch(
            `${GENERATE_BASE_URL('neo3')}/asset/${notification.contract}`,
          )
          const assetJson = await assetResponse.json()
          const { symbol, decimals, name } = assetJson
          const integerNotfication = notification.state.value.find(
            value => value.type === 'Integer',
          )
          const amount = integerNotfication ? integerNotfication.value : 0
          const from_address = neo3_getAddressFromSriptHash(
            // eslint-disable-next-line
            // @ts-ignore
            notification?.state?.value[1].value || '',
          )
          const to_address = neo3_getAddressFromSriptHash(
            // eslint-disable-next-line
            // @ts-ignore
            notification?.state?.value[2].value || '',
          )
          transfers.push({
            name,
            symbol,
            amount: convertToArbitraryDecimals(Number(amount), decimals),
            to: to_address,
            from: from_address,
          })
        }
      }
    }
  }
  return transfers
}

interface MatchParams {
  hash: string
  chain: string
  network: string
}

type Props = RouteComponentProps<MatchParams>

const Transaction: React.FC<Props> = (props: Props) => {
  const { hash, chain, network } = props.match.params
  const dispatch = useDispatch()
  const history = useHistory()
  const transferArr: ParsedTransfer[] = []
  const [transfers, setTransfers] = useState(transferArr)
  const [localLoadComplete, setLocalLoadComplete] = useState(false)

  const transactionState = useSelector(
    ({ transaction }: { transaction: TransactionState }) => transaction,
  )
  const { transaction, isLoading } = transactionState

  const renderSkeleton = (
    value: null | string | ReactElement,
  ): null | string | ReactElement => {
    if (!transaction || isLoading || !localLoadComplete || !value) {
      return null
    }

    return value
  }

  useUpdateNetworkState(props)

  useEffect(() => {
    async function computeTransfers(): Promise<void> {
      if (transaction) {
        setLocalLoadComplete(true)

        const transfers =
          chain === 'neo3'
            ? await parseNeo3TransactionData(transaction)
            : await parseAbstractData(transaction)

        setTransfers(transfers)
      }
    }
    dispatch(fetchTransaction(hash, chain))
    computeTransfers()

    return (): void => {
      setTransfers([])
    }
  }, [chain, dispatch, hash, transaction])

  if (chain === 'neo2')
    return (
      <div id="Transaction" className="page-container">
        <div className="inner-page-container">
          <Breadcrumbs
            crumbs={[
              {
                url: ROUTES.HOME.url,
                label: 'Home',
              },
              {
                url: ROUTES.TRANSACTIONS.url,
                label: 'Transactions',
              },
              {
                url: '#',
                label: 'Transaction info',
                active: true,
              },
            ]}
          />

          <BackButton
            url={ROUTES.TRANSACTIONS.url}
            text="back to transactions"
          />
          <div className="page-title-container">
            {ROUTES.TRANSACTIONS.renderIcon()}
            <h1>Transaction Information</h1>
          </div>

          {!!transfers.length && (
            <Transfer
              chain={'neo2'}
              transfers={transfers}
              handleAddressClick={(address): void =>
                history.push(`/address/${chain}/${network}/${address}`)
              }
              networkFee={transaction ? transaction.net_fee : ''}
              systemFee={transaction ? transaction.sys_fee : ''}
              size={transaction ? transaction.size : ''}
            />
          )}
          <div id="transaction-details-container">
            <div className="details-section">
              <div className="section-label">DETAILS</div>
              <div className="inner-details-container">
                <div className="detail-tile-row">
                  <div className="detail-tile">
                    <label>TYPE</label>
                    <span>
                      {renderSkeleton(transaction && transaction.type)}
                    </span>
                  </div>

                  <div className="detail-tile">
                    <label>SIZE</label>
                    <span>
                      {renderSkeleton(
                        transaction &&
                          `${transaction.size.toLocaleString()} bytes`,
                      )}
                    </span>
                  </div>
                </div>

                <div className="detail-tile-row">
                  <div className="detail-tile">
                    <label>INCLUDED IN BLOCK</label>
                    <span>
                      {renderSkeleton(
                        transaction && transaction.block.toLocaleString(),
                      )}
                    </span>
                  </div>

                  <div className="detail-tile">
                    <label>TIME</label>
                    <span id="time-details-row">
                      <div>
                        {renderSkeleton(
                          transaction && (
                            <>
                              <DateRangeIcon
                                style={{ color: '#7698A9', fontSize: 20 }}
                              />
                              {moment
                                .unix(transaction.time)
                                .format('MM-DD-YYYY')}
                            </>
                          ),
                        )}
                      </div>
                      <div>
                        {renderSkeleton(
                          transaction && (
                            <>
                              <Icon
                                icon={clockIcon}
                                style={{ color: '#7698A9', fontSize: 18 }}
                              />
                              {moment.unix(transaction.time).format('hh:mm:ss')}
                            </>
                          ),
                        )}
                      </div>
                    </span>
                  </div>
                </div>

                <div className="transaction-hash-tile detail-tile">
                  <label>HASH</label>
                  <span>{renderSkeleton(transaction && transaction.txid)}</span>
                </div>

                {transaction && transaction.scripts && transaction.scripts[0] && (
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
                      <div className="detail-tile script-tile">
                        <label> SCRIPT</label>
                        <span>
                          {!isLoading && transaction && transaction.script}
                        </span>
                      </div>
                    </div>
                  </ExpandingPanel>
                )}

                {transaction && transaction.scripts && transaction.scripts[0] && (
                  <div style={{ margin: '24px 0' }}>
                    <ExpandingPanel title="DISASSEMBLED SCRIPT" open={false}>
                      <div className="script-tile-row">
                        <div className="detail-tile script-tile">
                          <label>INVOCATION SCRIPT</label>
                          <span>
                            {!isLoading &&
                              transaction &&
                              disassemble(
                                transaction.scripts[0].invocation,
                              )}{' '}
                          </span>
                        </div>
                        <div className="detail-tile script-tile">
                          <label>VERIFICATION SCRIPT</label>
                          <span>
                            {!isLoading &&
                              transaction &&
                              transaction.scripts &&
                              transaction.scripts[0] &&
                              disassemble(
                                transaction.scripts[0].verification,
                              )}{' '}
                          </span>
                        </div>
                        <div className="detail-tile script-tile">
                          <label> SCRIPT</label>
                          <span>
                            {!isLoading &&
                              transaction &&
                              transaction.script &&
                              disassemble(transaction.script)}{' '}
                          </span>
                        </div>
                      </div>
                    </ExpandingPanel>
                  </div>
                )}

                {transaction &&
                  transaction.Item &&
                  transaction.Item.notifications &&
                  !!transaction.Item.notifications.length &&
                  transaction.Item.notifications.map(notification => (
                    <Notification
                      chain={chain}
                      network={network}
                      key={uniqueId()}
                      notification={notification}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )

  return (
    <div id="Transaction" className="page-container">
      <div className="inner-page-container">
        <Breadcrumbs
          crumbs={[
            {
              url: ROUTES.HOME.url,
              label: 'Home',
            },
            {
              url: ROUTES.TRANSACTIONS.url,
              label: 'Transactions',
            },
            {
              url: '#',
              label: 'Transaction info',
              active: true,
            },
          ]}
        />

        <BackButton url={ROUTES.TRANSACTIONS.url} text="back to transactions" />
        <div className="page-title-container">
          {ROUTES.TRANSACTIONS.renderIcon()}
          <h1>Transaction Information</h1>
        </div>

        {!!transfers.length && (
          <Transfer
            chain={'neo3'}
            transfers={transfers}
            handleAddressClick={(address): void =>
              history.push(`/address/${address}`)
            }
            networkFee={transaction ? transaction.net_fee : ''}
            systemFee={transaction ? transaction.sys_fee : ''}
            size={transaction ? transaction.size : ''}
          />
        )}
        <div id="transaction-details-container">
          <div className="details-section">
            <div className="section-label">DETAILS</div>
            <div className="inner-details-container">
              <div className="detail-tile-row">
                <div className="detail-tile">
                  <label>SENDER</label>
                  <span className="small-pink-text">
                    {renderSkeleton(
                      transaction && transaction.sender
                        ? transaction.sender
                        : '',
                    )}
                  </span>
                </div>

                <div className="detail-tile">
                  <label>SIZE</label>
                  <span>
                    {renderSkeleton(
                      transaction &&
                        `${transaction.size.toLocaleString()} bytes`,
                    )}
                  </span>
                </div>
              </div>

              <div className="detail-tile-row">
                <div className="detail-tile">
                  <label>INCLUDED IN BLOCK</label>
                  <span>
                    {renderSkeleton(
                      transaction && transaction.block.toLocaleString(),
                    )}
                  </span>
                </div>

                <div className="detail-tile">
                  <label>TIME</label>
                  <span id="time-details-row">
                    <div>
                      {renderSkeleton(
                        transaction && (
                          <>
                            <DateRangeIcon
                              style={{ color: '#7698A9', fontSize: 20 }}
                            />
                            {formatDate(transaction.time)}
                          </>
                        ),
                      )}
                    </div>
                    <div>
                      {renderSkeleton(
                        transaction && (
                          <>
                            <Icon
                              icon={clockIcon}
                              style={{ color: '#7698A9', fontSize: 18 }}
                            />
                            {formatHours(transaction.time)}
                          </>
                        ),
                      )}
                    </div>
                  </span>
                </div>
              </div>

              <div className="transaction-hash-tile detail-tile">
                <label>HASH</label>
                <span>{renderSkeleton(transaction && transaction.txid)}</span>
              </div>

              {transaction &&
                transaction.witnesses &&
                transaction.witnesses[0] && (
                  <ExpandingPanel title="RAW SCRIPT" open={false}>
                    <div className="script-tile-row">
                      <div className="detail-tile script-tile">
                        <label>INVOCATION SCRIPT</label>
                        <span>
                          {!isLoading &&
                            transaction &&
                            transaction.witnesses[0].invocation}{' '}
                        </span>
                      </div>
                      <div className="detail-tile script-tile">
                        <label>VERIFICATION SCRIPT</label>
                        <span>
                          {!isLoading &&
                            transaction &&
                            transaction.witnesses[0].verification}{' '}
                        </span>
                      </div>
                      <div className="detail-tile script-tile">
                        <label> SCRIPT</label>
                        <span>
                          {!isLoading && transaction && transaction.script}
                        </span>
                      </div>
                    </div>
                  </ExpandingPanel>
                )}

              {transaction &&
                transaction.witnesses &&
                transaction.witnesses[0] && (
                  <div style={{ margin: '24px 0' }}>
                    <ExpandingPanel title="DISASSEMBLED SCRIPT" open={false}>
                      <div className="script-tile-row">
                        <div className="detail-tile script-tile">
                          <label>INVOCATION SCRIPT</label>
                          <span>
                            {!isLoading &&
                              transaction &&
                              neo3Disassemble(
                                transaction.witnesses[0].invocation,
                              )}{' '}
                          </span>
                        </div>
                        <div className="detail-tile script-tile">
                          <label>VERIFICATION SCRIPT</label>
                          <span>
                            {!isLoading &&
                              transaction &&
                              transaction.witnesses &&
                              transaction.witnesses[0] &&
                              neo3Disassemble(
                                transaction.witnesses[0].verification,
                              )}{' '}
                          </span>
                        </div>
                        <div className="detail-tile script-tile">
                          <label> SCRIPT</label>
                          <span>
                            {!isLoading &&
                              transaction &&
                              transaction.script &&
                              neo3Disassemble(transaction.script)}{' '}
                          </span>
                        </div>
                      </div>
                    </ExpandingPanel>
                  </div>
                )}

              {transaction &&
                transaction.notifications &&
                transaction.notifications.map(notification => (
                  <Notification
                    chain={chain}
                    network={network}
                    key={uniqueId()}
                    notification={notification}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withRouter(Transaction)
