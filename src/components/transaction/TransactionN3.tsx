import Transfer from '../transfer/Transfer'
import DateRangeIcon from '@material-ui/icons/DateRange'
import { Icon } from '@iconify/react'
import clockIcon from '@iconify/icons-simple-line-icons/clock'
import { ParsedTransfer } from '../../pages/transaction/Transaction'
import { DetailedTransaction } from '../../reducers/transactionReducer'
import { formatDate, format24Hours } from '../../utils/time'
import ExpandingPanel from '../panel/ExpandingPanel'
import Notification from './notification/Notification'
import { TransactionBlock } from './TransactionBlock'
import { neo3Disassemble } from '../../utils/neo3-disassemble'
import { TransactionLogView } from '../../pages/transaction/fragment/TransactionLog'
import Signature from './signatures/Signature'
import { Box, Flex, Text } from '@chakra-ui/react'
import useWindowWidth from '../../hooks/useWindowWidth'
import { StackResult } from './StackResult'

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
  const width = useWindowWidth()

  const isMobileOrTablet = width <= 768

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

      <Box id="transaction-details-container">
        <Box className="details-section">
          <Text
            lineHeight={'48px'}
            fontSize={'sm'}
            fontWeight={700}
            letterSpacing={'-0.56px'}
            mx={1}
          >
            DETAILS
          </Text>

          <Flex
            direction={'column'}
            color={'medium-grey'}
            fontWeight={700}
            fontSize={'xs'}
          >
            <Flex
              direction={['column', 'row']}
              className="detail-tile-row"
              flexWrap={'unset'}
            >
              <Flex
                className="detail-tile"
                minH={['54px', '74px']}
                overflow={'hidden'}
                maxW={'100%'}
              >
                <Text flex={1}>SENDER</Text>

                <Text
                  color={'tertiary'}
                  isTruncated
                  fontSize={'lg'}
                  fontWeight={600}
                  textAlign={['right', 'center']}
                  flex={1}
                >
                  {transaction.sender}
                </Text>
              </Flex>

              <Flex className="detail-tile" minH={['54px', '74px']}>
                <Text flex={1}>SIZE</Text>

                <Text
                  color={'white'}
                  isTruncated
                  fontSize={'lg'}
                  fontWeight={600}
                  textAlign={['right', 'center']}
                  flex={1}
                >
                  {transaction.size?.toLocaleString()} bytes
                </Text>
              </Flex>
            </Flex>

            <Flex direction={['column', 'row']} className="detail-tile-row">
              <Flex className="detail-tile" minH={['54px', '74px']}>
                <Text flex={1}>INCLUDED IN BLOCK</Text>

                <Text
                  color={'white'}
                  isTruncated
                  fontSize={'lg'}
                  fontWeight={600}
                  textAlign={['right', 'center']}
                  flex={1}
                >
                  {transaction.block?.toLocaleString()}
                </Text>
              </Flex>

              <Flex className="detail-tile" minH={['54px', '74px']}>
                <Text flex={1}>TIME</Text>

                <Flex
                  flexDir={['column', 'row']}
                  color={'white'}
                  isTruncated
                  fontSize={['sm', 'sm', 'lg']}
                  fontWeight={600}
                  flex={1}
                  justifyContent={['unset', 'center']}
                >
                  <Flex mb={1}>
                    <Flex flex={1} justifyContent={'end'} mx={[2, 1]}>
                      <DateRangeIcon
                        style={{
                          color: '#7698a9',
                          fontSize: isMobileOrTablet ? 11 : 16,
                        }}
                      />
                    </Flex>
                    {formatDate(transaction.time)}
                  </Flex>
                  <Flex>
                    <Flex flex={1} justifyContent={'end'} mx={[2, 1]}>
                      <Icon
                        icon={clockIcon}
                        style={{
                          color: '#7698a9',
                          fontSize: isMobileOrTablet ? 11 : 16,
                        }}
                      />
                    </Flex>
                    <Text w={'75px'}>{format24Hours(transaction.time)}</Text>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>

            <TransactionLogView transaction={transaction} mb={5} />

            {transaction.stack && transaction.stack.length > 0 && (
              <StackResult chain={chain} stack={transaction.stack} />
            )}

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
        </Box>
      </Box>
    </>
  )
}
