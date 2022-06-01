import React, { ReactElement, useEffect, useState } from 'react'
import {
  NotificationState,
  NotificationStateValue,
} from '../../../../reducers/transactionReducer'
import { Box, Flex, Text } from '@chakra-ui/react'
import { TX_STATE_TYPE_MAPPINGS } from '../../../../constants'
import Copy from '../../../copy/Copy'
import { NotificationRow } from './NotificationRow'

export const NotificationPanel: React.FC<{
  state: NotificationState
  chain?: string
  destruct?: boolean
  parameters: string[]
}> = ({ state, chain, destruct, parameters }): ReactElement => {
  const [stateValue, setStateValue] = useState<Record<string, string>>({})
  const [values, setValues] = useState<NotificationStateValue[]>([])

  const destructState = (
    values: NotificationStateValue[],
  ): NotificationStateValue[] => {
    return values.flatMap<NotificationStateValue>(it => {
      const { type, value } = it

      if (type === 'Array' && typeof value === 'object') {
        return destructState(value as NotificationStateValue[])
      }

      return it
    })
  }

  useEffect(() => {
    const items = destruct ? destructState([...state.value]) : [...state.value]

    setValues(
      items.map(it => {
        setStateValue(currentVal => ({
          ...currentVal,
          [it.value]: it.value,
        }))

        return it
      }),
    )

    return () => {
      setValues([])
      setStateValue({})
    }
  }, [state.value, destruct])

  return (
    <Flex direction={'column'} bg={'gray'} fontWeight={500} mb={4}>
      {values.map((state, index) => (
        <Flex
          direction={'column'}
          key={state.value + index}
          mb={index !== values.length - 1 ? 2 : 0}
        >
          <Flex
            justifyContent={'space-between'}
            minH={10}
            alignItems={'center'}
            bg={'white-200'}
          >
            <Flex>
              <Text color={'white-500'} ml={2} mr={0.5}>
                [{index}]
              </Text>
              {parameters[index] && (
                <Text color={'white'} fontSize={'md'}>
                  {parameters[index]}
                </Text>
              )}
            </Flex>
            <Flex alignItems={'center'}>
              {TX_STATE_TYPE_MAPPINGS[state.type] && (
                <Flex
                  py={1}
                  px={3}
                  mx={1}
                  fontSize={'xs'}
                  bg={TX_STATE_TYPE_MAPPINGS[state.type]?.color}
                  color={'medium-grey-blue'}
                >
                  {state.type}
                </Flex>
              )}
              {state.type !== 'Array' &&
                state.value &&
                TX_STATE_TYPE_MAPPINGS[state.type]?.options && (
                  <NotificationRow
                    value={state.value}
                    type={state.type}
                    options={TX_STATE_TYPE_MAPPINGS[state.type].options}
                    chain={chain}
                    handleValue={(event: string) =>
                      setStateValue({ ...stateValue, [state.value]: event })
                    }
                  />
                )}
            </Flex>
          </Flex>
          {state.type === 'Array' ? (
            <Box pt={3} px={3} bg={'gray'}>
              <NotificationPanel
                state={state as unknown as NotificationState}
                chain={chain}
                parameters={[]}
                destruct
              />
            </Box>
          ) : (
            <Flex
              px={7}
              py={2}
              bg={'white-100'}
              alignItems={'center'}
              minHeight={5}
            >
              <Text fontSize={'sm'} fontWeight={400} flex={1} color={'grey'}>
                {stateValue[state.value]}
              </Text>
              {stateValue[state.value] && (
                <Copy text={String(stateValue[state.value])} />
              )}
            </Flex>
          )}
        </Flex>
      ))}
    </Flex>
  )
}
