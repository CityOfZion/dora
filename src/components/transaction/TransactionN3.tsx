import Transfer from '../transfer/Transfer'
import DateRangeIcon from '@material-ui/icons/DateRange'
import { Icon } from '@iconify/react'
import clockIcon from '@iconify/icons-simple-line-icons/clock'
import { ParsedTransfer } from '../../pages/transaction/Transaction'
import { DetailedTransaction } from '../../reducers/transactionReducer'
import { formatDate, formatHours } from '../../utils/time'
import ExpandingPanel from '../panel/ExpandingPanel'
import Notification from '../notification/Notification'
import { uniqueId } from 'lodash'
import { TransactionBlock } from './TransactionBlock'
import { neo3Disassemble } from '../../utils/neo3-disassemble'
import { TransactionLogView } from '../../pages/transaction/fragment/TransactionLog'

type Props = {
  transfers: ParsedTransfer[]
  transaction: DetailedTransaction
  chain: string
  network: string
}

export const TransactionN3: React.FC<Props> = ({
  chain,
  network,
  transaction,
  transfers,
}) => {
  return (
    <>
      {!!transfers.length && (
        <Transfer
          chain={'neo3'}
          transfers={transfers}
          network={network}
          transaction={transaction}
        />
      )}

      <div id="transaction-details-container">
        <div className="details-section">
          <div className="section-label">DETAILS</div>
          <div className="inner-details-container">
            <div className="detail-tile-row">
              <div className="detail-tile">
                <label>SENDER</label>

                <span className="small-pink-text">{transaction.sender}</span>
              </div>

              <div className="detail-tile">
                <label>SIZE</label>

                <span>{transaction.size.toLocaleString()} bytes</span>
              </div>
            </div>

            <div className="detail-tile-row">
              <div className="detail-tile">
                <label>INCLUDED IN BLOCK</label>

                <span>{transaction.block.toLocaleString()}</span>
              </div>

              <div className="detail-tile">
                <label>TIME</label>
                <span id="time-details-row">
                  <div>
                    <DateRangeIcon style={{ color: '#7698A9', fontSize: 20 }} />
                    {formatDate(transaction.time)}
                  </div>
                  <div>
                    <Icon
                      icon={clockIcon}
                      style={{ color: '#7698A9', fontSize: 18 }}
                    />
                    {formatHours(transaction.time)}
                  </div>
                </span>
              </div>
            </div>

            <TransactionLogView transaction={transaction} mb={5} />

            {transaction.signers && transaction.signers[0] && (
              <ExpandingPanel title="SIGNERS" open={false}>
                {transaction.signers.map(signer => (
                  <div key={signer.account} className="script-tile-row">
                    <div className="detail-tile script-tile">
                      <label>ACCOUNT</label>
                      <span>{signer.account}</span>
                    </div>
                    <div className="detail-tile script-tile">
                      <label>SCOPES</label>
                      <span>{signer.scopes}</span>
                    </div>
                  </div>
                ))}
              </ExpandingPanel>
            )}

            {transaction.exception && (
              <div style={{ margin: '24px 0' }}>
                <ExpandingPanel title="EXCEPTION" open={false}>
                  <div className="script-tile-row">
                    <div className="detail-tile script-tile">
                      <label>EXCEPTION</label>
                      <span>{transaction.exception}</span>
                    </div>
                  </div>
                </ExpandingPanel>
              </div>
            )}

            {transaction.notifications &&
              !!transaction.notifications.length &&
              transaction.notifications.map(notification => (
                <div style={{ opacity: transaction.exception ? 0.6 : 1 }}>
                  <Notification
                    chain={chain}
                    network={network}
                    key={uniqueId()}
                    notification={notification}
                  />
                </div>
              ))}

            {transaction.witnesses && transaction.witnesses[0] && (
              <>
                <ExpandingPanel title="RAW SCRIPT" open={false}>
                  <div className="script-tile-row">
                    <TransactionBlock
                      label="INVOCATION SCRIPT"
                      value={transaction.witnesses[0].invocation}
                      withCopyButton
                    />
                    <TransactionBlock
                      label="VERIFICATION SCRIPT"
                      value={transaction.witnesses[0].verification}
                      withCopyButton
                    />
                    <TransactionBlock
                      label="SCRIPT"
                      value={transaction.script}
                      withCopyButton
                    />
                  </div>
                </ExpandingPanel>

                <div style={{ margin: '24px 0' }}>
                  <ExpandingPanel title="DISASSEMBLED SCRIPT" open={false}>
                    <div className="script-tile-row">
                      <TransactionBlock
                        label="INVOCATION SCRIPT"
                        value={neo3Disassemble(
                          transaction.witnesses[0].invocation,
                        )}
                        withCopyButton
                      />

                      <TransactionBlock
                        label="VERIFICATION SCRIPT"
                        value={neo3Disassemble(
                          transaction.witnesses[0].verification,
                        )}
                        withCopyButton
                      />
                      <TransactionBlock
                        label="SCRIPT"
                        value={
                          transaction.script
                            ? neo3Disassemble(transaction.script)
                            : ''
                        }
                        withCopyButton
                      />
                    </div>
                  </ExpandingPanel>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
