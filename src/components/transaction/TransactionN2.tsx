import { disassemble } from '../../utils/disassemble'
import ExpandingPanel from '../panel/ExpandingPanel'
import Transfer from '../transfer/Transfer'
import { TransactionBlock } from './TransactionBlock'
import Notification from './notification/Notification'
import { ParsedTransfer } from '../../pages/transaction/Transaction'
import { DetailedTransaction } from '../../reducers/transactionReducer'
import DateRangeIcon from '@material-ui/icons/DateRange'
import { Icon } from '@iconify/react'
import clockIcon from '@iconify/icons-simple-line-icons/clock'
import { formatDate, formatHours } from '../../utils/time'
import { TransactionLogView } from '../../pages/transaction/fragment/TransactionLog'
import { uuid } from '../../utils/formatter'
import { Box, Flex, Text } from '@chakra-ui/react'
import useWindowWidth from '../../hooks/useWindowWidth'

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
  const width = useWindowWidth()

  const isMobileOrTablet = width <= 768

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
      <Box id="transaction-details-container">
        <Box className="details-section">
          <Text className="section-label">DETAILS</Text>
          <Flex
            className="inner-details-container"
            flexDir={'column'}
            color={'medium-grey'}
            fontWeight={700}
            fontSize={'xs'}
          >
            <Flex className="detail-tile-row" flexDir={['column', 'row']}>
              <Flex
                className="detail-tile"
                minH={['54px', '74px']}
                overflow={'hidden'}
                maxW={'100%'}
              >
                <Text flex={1}>TYPE</Text>

                <Text
                  color={'white'}
                  isTruncated
                  fontSize={'lg'}
                  fontWeight={600}
                  textAlign={['right', 'center']}
                  flex={1}
                >
                  {transaction.type}
                </Text>
              </Flex>

              <Flex
                className="detail-tile"
                minH={['54px', '74px']}
                overflow={'hidden'}
                maxW={'100%'}
              >
                <Text flex={1}>SIZE</Text>

                <Text
                  color={'white'}
                  isTruncated
                  fontSize={'lg'}
                  fontWeight={600}
                  textAlign={['right', 'center']}
                  flex={1}
                >
                  {transaction.size.toLocaleString()} bytes
                </Text>
              </Flex>
            </Flex>

            <Flex className="detail-tile-row" flexDir={['column', 'row']}>
              <Flex
                className="detail-tile"
                minH={['54px', '74px']}
                overflow={'hidden'}
                maxW={'100%'}
              >
                <Text flex={1}>INCLUDED IN BLOCK</Text>

                <Text
                  color={'white'}
                  isTruncated
                  fontSize={'lg'}
                  fontWeight={600}
                  textAlign={['right', 'center']}
                  flex={1}
                >
                  {transaction.block.toLocaleString()}
                </Text>
              </Flex>

              <Flex
                className="detail-tile"
                minH={['54px', '74px']}
                overflow={'hidden'}
                maxW={'100%'}
              >
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
                    <Text w={'75px'}>{formatHours(transaction.time)}</Text>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>

            <TransactionLogView transaction={transaction} mb={5} />

            {transaction.Item && !!transaction.Item.notifications.length && (
              <Notification
                chain={chain}
                network={network}
                key={uuid()}
                notifications={transaction.Item.notifications}
              />
            )}

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
          </Flex>
        </Box>
      </Box>
    </>
  )
}
