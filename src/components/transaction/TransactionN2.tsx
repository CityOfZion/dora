import { disassemble } from '../../utils/disassemble'
import ExpandingPanel from '../panel/ExpandingPanel'
import Transfer from '../transfer/Transfer'
import { TransactionBlock } from './TransactionBlock'
import Notification from '../notification/Notification'
import { ParsedTransfer } from '../../pages/transaction/Transaction'
import { DetailedTransaction } from '../../reducers/transactionReducer'
import DateRangeIcon from '@material-ui/icons/DateRange'
import { Icon } from '@iconify/react'
import clockIcon from '@iconify/icons-simple-line-icons/clock'
import { formatDate, formatHours } from '../../utils/time'
import { uniqueId } from 'lodash'
import { TransactionLogView } from '../../pages/transaction/fragment/TransactionLog'

type Props = {
  transfers: ParsedTransfer[]
  transaction: DetailedTransaction
  chain: string
  network: string
}

export const TransactionN2: React.FC<Props> = ({
  transaction,
  transfers,
  chain,
  network,
}) => {
  return (
    <>
      {!!transfers.length && (
        <Transfer
          chain={'neo2'}
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
                <label>TYPE</label>

                <span>{transaction.type}</span>
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

            {transaction.Item &&
              !!transaction.Item.notifications.length &&
              transaction.Item.notifications.map(notification => (
                <Notification
                  chain={chain}
                  network={network}
                  key={uniqueId()}
                  notification={notification}
                />
              ))}

            {transaction.scripts && transaction.scripts[0] && (
              <>
                <ExpandingPanel title="RAW SCRIPT" open={false}>
                  <div className="script-tile-row">
                    <TransactionBlock
                      label="INVOCATION SCRIPT"
                      value={transaction.scripts[0].invocation}
                      withCopyButton
                    />
                    <TransactionBlock
                      label="VERIFICATION SCRIPT"
                      value={transaction.scripts[0].verification}
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
                        value={String(
                          disassemble(transaction.scripts[0].invocation),
                        )}
                        withCopyButton
                      />

                      <TransactionBlock
                        label="VERIFICATION SCRIPT"
                        value={String(
                          disassemble(transaction.scripts[0].verification),
                        )}
                        withCopyButton
                      />
                      <TransactionBlock
                        label="SCRIPT"
                        value={String(disassemble(transaction.script))}
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
