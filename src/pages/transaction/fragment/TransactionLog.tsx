import React, { useEffect, useState } from 'react'
import { Box, BoxProps, Flex, Text } from '@chakra-ui/react'
import Copy from '../../../components/copy/Copy'
import { DetailedTransaction } from '../../../reducers/transactionReducer'

import { NeoRESTApi } from '@cityofzion/dora-ts/dist/api'
import { store } from '../../../store'
import { LogResponse } from '@cityofzion/dora-ts/dist/interfaces/api/neo'

const NeoRest = new NeoRESTApi({
  doraUrl: 'https://dora.coz.io',
  endpoint: '/api/v2/neo3',
})

interface Props extends BoxProps {
  transaction: DetailedTransaction | null
}

export const TransactionLogView = ({ transaction, ...props }: Props) => {
  const [transactionLog, setTransactionLog] = useState({} as LogResponse)

  useEffect(() => {
    const getTransactionLog = async () => {
      if (!transaction) return

      const { network } = store.getState().network
      try {
        const txLog = await NeoRest.log(transaction.txid, network)
        setTransactionLog(txLog)
      } catch (error) {
        console.error(error)
      }
    }

    getTransactionLog()

    return (): void => {
      setTransactionLog({} as LogResponse)
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
          <Flex justifyContent={'space-between'} alignItems={'center'}>
            <Text color={'medium-grey'} fontSize={'xs'}>
              HASH
            </Text>
            <Text display={['inline', 'none']}>
              <Copy text={transaction?.txid ?? ''} />
            </Text>
          </Flex>

          <Flex alignItems={'center'} flex={1} justifyContent={'space-between'}>
            <Text
              fontSize={'sm'}
              isTruncated
              color={'tertiary'}
              textOverflow={'clip'}
              mx={[0, 2]}
              flex={1}
              textAlign={'center'}
            >
              {transaction && transaction.txid}
            </Text>
            <Text display={['none', 'inline']}>
              <Copy text={transaction?.txid ?? ''} />
            </Text>
          </Flex>
        </Box>

        {!!transactionLog.trigger && (
          <Flex className="detail-tile" minH={['54px', '74px']}>
            <Text color={'medium-grey'} fontSize={'xs'} flex={1}>
              TRIGGER
            </Text>
            <Text
              color={'white'}
              isTruncated
              fontSize={'lg'}
              fontWeight={600}
              textAlign={['right', 'center']}
              flex={1}
            >
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
