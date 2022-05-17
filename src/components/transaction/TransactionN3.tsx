import Transfer from '../transfer/Transfer'
import DateRangeIcon from '@material-ui/icons/DateRange'
import { Icon } from '@iconify/react'
import clockIcon from '@iconify/icons-simple-line-icons/clock'
import { ParsedTransfer } from '../../pages/transaction/Transaction'
import { DetailedTransaction } from '../../reducers/transactionReducer'
import { formatDate, formatHours } from '../../utils/time'
import ExpandingPanel from '../panel/ExpandingPanel'
import Notification from './notification/Notification'
import { TransactionBlock } from './TransactionBlock'
import { neo3Disassemble } from '../../utils/neo3-disassemble'
import { TransactionLogView } from '../../pages/transaction/fragment/TransactionLog'
import { uuid } from '../../utils/formatter'
import Signature from './signatures/Signature'
import { Flex } from '@chakra-ui/react'

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
          <Flex direction={'column'} className="inner-details-container">
            <Flex direction={['column', 'row']} className="detail-tile-row">
              <Flex className="detail-tile" minH={['54px', '74px']}>
                <label>SENDER</label>

                <span className="small-pink-text">{transaction.sender}</span>
              </Flex>

              <Flex className="detail-tile" minH={['54px', '74px']}>
                <label>SIZE</label>

                <span>{transaction.size?.toLocaleString()} bytes</span>
              </Flex>
            </Flex>

            <Flex direction={['column', 'row']} className="detail-tile-row">
              <Flex className="detail-tile" minH={['54px', '74px']}>
                <label>INCLUDED IN BLOCK</label>

                <span>{transaction.block?.toLocaleString()}</span>
              </Flex>

              <Flex className="detail-tile" minH={['54px', '74px']}>
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
              </Flex>
            </Flex>

            <TransactionLogView transaction={transaction} mb={5} />

            {transaction.signers && transaction.signers[0] && (
              <Signature
                chain={chain}
                network={network}
                signers={transaction.signers}
              />
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
              !!transaction.notifications.length && (
                <Notification
                  chain={chain}
                  network={network}
                  key={uuid()}
                  notifications={transaction.notifications}
                />
              )}

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
          </Flex>
        </div>
      </div>
    </>
  )
}
