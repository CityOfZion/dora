import React, { ReactElement, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import ExpandingPanel from '../../panel/ExpandingPanel'
import { TransactionNotification } from '../../../reducers/transactionReducer'
import { Box, Collapse, Flex, Text } from '@chakra-ui/react'
import Copy from '../../copy/Copy'
import { ROUTES } from '../../../constants'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { uuid } from '../../../utils/formatter'
import { u } from '@cityofzion/neon-js'
import { StackPanel } from '../StackPanel'
import { NeoRESTApi } from '@cityofzion/dora-ts/dist/api'
import { ContractResponse } from '@cityofzion/dora-ts/dist/interfaces/api/neo'

const NeoRest = new NeoRESTApi({
  doraUrl: 'https://dora.coz.io',
  endpoint: '/api/v2/neo3',
})

export const Notification: React.FC<{
  notifications: TransactionNotification[]
  chain: string
  network: string
}> = ({ notifications, chain, network }): ReactElement => {
  const [isOpen, setOpen] = useState<Record<string, boolean>>({})
  const [isLoading, setLoading] = useState<boolean>(false)
  const [items, setItems] = useState<TransactionNotification[]>([])
  const [contracts, setContracts] = useState<ContractResponse[]>([])

  const getContractFromHash = (hash: string) => {
    return contracts.find(contract => contract.hash === hash)
  }

  useEffect(() => {
    //fix for NEP-17 contract that emit transfer events with ByteString as amount
    for (const notification of notifications) {
      if (notification.state.type === 'Array') {
        if (
          !notification.state.value ||
          !Array.isArray(notification.state.value)
        )
          continue

        const isTransfer = notification.event_name === 'Transfer'

        if (isTransfer) {
          const amountStackItem = notification.state.value[2]
          if (amountStackItem.type === 'ByteString') {
            const hexstr = Buffer.from(
              String(amountStackItem.value),
              'hex',
            ).toString('hex')
            const value = u.BigInteger.fromHex(hexstr, true)
            amountStackItem.type = 'Integer'
            amountStackItem.value = value.toString()
          }
        }
      }

      notification.id = uuid()
    }

    setItems(notifications)

    setOpen(Object.fromEntries(items.map(item => [item.id, false])))
    return () => {
      setItems([])
      setContracts([])
      setOpen({})
    }
  }, [notifications])

  const populateContract = async () => {
    try {
      setLoading(true)

      const contractsHash = items
        .map(item => item.contract)
        .filter((item, index, array) => array.indexOf(item) === index)

      const promises = contractsHash.map(item =>
        NeoRest.contract(item, network),
      )

      const fetchedContracts = await Promise.all(promises)
      setContracts(fetchedContracts)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box my={3}>
      <ExpandingPanel
        title={<Text>NOTIFICATIONS</Text>}
        open={false}
        handleClick={(isOpen: boolean) => isOpen && populateContract()}
      >
        {isLoading && (
          <SkeletonTheme
            color="#21383d"
            highlightColor="rgb(125 159 177 / 25%)"
          >
            <Skeleton
              count={items.length}
              style={{ margin: '5px 0', height: '40px' }}
            />
          </SkeletonTheme>
        )}
        {!isLoading &&
          items.map((notification, index) => {
            const contract = getContractFromHash(notification.contract)
            return (
              <Box key={notification.id + index}>
                <Box bg={'medium-grey-blue'} mt={3} px={3}>
                  <Flex
                    justifyContent={'space-between'}
                    py={2}
                    borderBottom={'2px solid'}
                    borderColor={'gray.600'}
                    cursor={'pointer'}
                    alignItems={'center'}
                    onClick={() =>
                      setOpen({
                        ...isOpen,
                        [notification.id]: !isOpen[notification.id],
                      })
                    }
                  >
                    <Flex flexDir={'column'}>
                      <Text
                        fontWeight={500}
                        color={'white'}
                        fontSize={'md'}
                        mb={1}
                      >
                        {contract?.manifest?.name}
                      </Text>
                      <Text
                        fontWeight={500}
                        color={'white'}
                        fontSize={'md'}
                        display={['inline', 'none']}
                      >
                        {notification.event_name}
                      </Text>
                    </Flex>
                    <Flex alignItems={'center'}>
                      <Text
                        fontWeight={500}
                        color={'white'}
                        fontSize={'md'}
                        display={['none', 'inline']}
                      >
                        {notification.event_name}
                      </Text>
                      {isOpen[notification.id] ? (
                        <Text mx={2} color={'tertiary'} fontSize={'4xl'}>
                          -
                        </Text>
                      ) : (
                        <Text mx={2} color={'tertiary'} fontSize={'4xl'}>
                          +
                        </Text>
                      )}
                    </Flex>
                  </Flex>

                  <Flex
                    justifyContent={'space-between'}
                    py={2}
                    flexDir={['column', 'row']}
                  >
                    <Flex justifyContent={'space-between'}>
                      <Text color={'medium-grey'} fontSize={'xs'}>
                        HASH
                      </Text>

                      <Text display={['inline', 'none']}>
                        <Copy text={notification.contract} />
                      </Text>
                    </Flex>

                    <Flex
                      alignItems={'center'}
                      overflow={'hidden'}
                      flex={1}
                      justifyContent={'end'}
                    >
                      <Text
                        fontSize={'sm'}
                        isTruncated
                        textOverflow={'clip'}
                        color={'tertiary'}
                        fontWeight={500}
                      >
                        <Link
                          to={`${ROUTES.CONTRACT.url}/${chain}/${network}/${notification.contract}`}
                        >
                          {notification.contract}
                        </Link>
                      </Text>
                      <Text display={['none', 'inline']} mx={1}>
                        <Copy text={notification.contract} />
                      </Text>
                    </Flex>
                  </Flex>
                </Box>

                <Collapse in={isOpen[notification.id]}>
                  {Array.isArray(notification.state.value) && (
                    <StackPanel
                      chain={chain}
                      keyName={'notification-stack'}
                      stack={notification.state.value}
                      names={
                        contract?.manifest?.abi?.events
                          ?.find(it => it.name === notification.event_name)
                          ?.parameters.map(it => it.name) || []
                      }
                    />
                  )}
                </Collapse>
              </Box>
            )
          })}
      </ExpandingPanel>
    </Box>
  )
}

export default Notification
