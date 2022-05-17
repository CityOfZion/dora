import React, { useEffect, useState } from 'react'
import { Box, BoxProps, Flex, Text } from '@chakra-ui/react'
import Copy from '../../../components/copy/Copy'
import { DetailedTransaction } from '../../../reducers/transactionReducer'
import { GENERATE_BASE_URL } from '../../../constants'
import { TransactionLog } from '../../../model/TransactionLog'

interface Props extends BoxProps {
  transaction: DetailedTransaction | null
}

export const TransactionLogView = ({ transaction, ...props }: Props) => {
  const [transactionLog, setTransactionLog] = useState({} as TransactionLog)

  useEffect(() => {
    const getTransactionLog = async () => {
      if (!transaction) return

      try {
        const response = await fetch(
          `${GENERATE_BASE_URL('neo3')}/log/${transaction.txid}`,
        )
        const json = await response.json()

        setTransactionLog(json.Item ? json.Item : json)
      } catch (error) {
        console.error(error)
      }
    }

    getTransactionLog()

    return (): void => {
      setTransactionLog({} as TransactionLog)
    }
  }, [transaction])

  return (
    <Box {...props} minH={'46px'}>
      <Flex direction={['column', 'row']}>
        <Box
          className="detail-tile"
          minH={['54px', '74px']}
          overflow={'hidden'}
        >
          <Text color={'medium-grey'} fontSize={'xs'}>
            HASH
          </Text>
          <Flex alignItems={'center'} flex={1} justifyContent={'space-between'}>
            <Text fontSize={'sm'} isTruncated color={'tertiary'} mx={8}>
              {transaction && transaction.txid}
            </Text>
            <Copy text={transaction?.txid ?? ''} />
          </Flex>
        </Box>

        {!!transactionLog.trigger && (
          <Flex className="detail-tile" minH={['54px', '74px']}>
            <Text color={'medium-grey'} fontSize={'xs'}>
              TRIGGER
            </Text>
            <Text m={'auto'} align={'center'} fontSize={'2xl'}>
              {transactionLog.trigger}
            </Text>
          </Flex>
        )}
      </Flex>

      {(!!transactionLog.vmstate || !!transactionLog.exception) && (
        <Box backgroundColor={'dark-grey'} p={1.5} m={'2px'} borderRadius={2}>
          <Flex justifyContent={'space-between'} mb={2}>
            <Text color={'medium-grey'} fontSize={'xs'}>
              VM STATE
            </Text>
            <Text
              backgroundColor={
                transactionLog.vmstate === 'FAULT' ? 'dark-pink' : 'green'
              }
              px={7}
              py={1.5}
              borderRadius={15}
              fontSize={'xs'}
              color={'medium-grey-blue'}
            >
              {transactionLog.vmstate}
            </Text>
          </Flex>
          {!!transactionLog.exception && (
            <Box borderTop={'1px solid'} borderColor={'white-200'} py={2}>
              <Text color={'medium-grey'} fontSize={'xs'} py={1}>
                EXCEPTION
              </Text>
              <Flex
                px={2}
                color={'medium-grey'}
                fontSize={'xs'}
                alignContent={'center'}
              >
                <Text color={'white-700'} flexGrow={1} mx={1}>
                  {transactionLog.exception}
                </Text>
                <Copy text={transactionLog.exception ?? ''} />
              </Flex>
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}
