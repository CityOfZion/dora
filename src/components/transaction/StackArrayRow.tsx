import { Flex, Text } from '@chakra-ui/react'
import { useMemo } from 'react'
import { TX_STATE_TYPE_MAPPINGS } from '../../constants'
import { StackState } from '../../reducers/transactionReducer'
import { StackRow } from './StackRow'

type Props = {
  state: StackState
  chain?: string
  index: number
  name?: string
}

export const StackArrayRow = ({ state, chain, index, name }: Props) => {
  const stackStates = useMemo(() => {
    const destructState = (stateToDestruct: StackState): StackState[] => {
      if (!stateToDestruct.value || !Array.isArray(stateToDestruct.value))
        return []

      return stateToDestruct.value.flatMap(it => {
        if (it.type === 'Array' && typeof it.value === 'object') {
          return destructState(it)
        }

        return it
      })
    }

    return destructState(state)
  }, [state])

  const typeStates = TX_STATE_TYPE_MAPPINGS[state.type]

  return (
    <Flex direction={'column'}>
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

          {name && (
            <Text color={'white'} fontSize={'md'}>
              {name}
            </Text>
          )}
        </Flex>

        <Flex alignItems={'center'}>
          {typeStates && (
            <Flex
              py={1}
              px={3}
              mx={1}
              fontSize={'xs'}
              bg={typeStates.color}
              color={'medium-grey-blue'}
            >
              {state.type}
            </Flex>
          )}
        </Flex>
      </Flex>

      <Flex direction={'column'} gridRowGap={4} py={3} px={3} bg={'gray'}>
        {stackStates.map((stackState, index) => (
          <StackRow
            index={index}
            type={stackState.type}
            value={String(stackState.value)}
            key={`stack-array-row-${index}`}
            chain={chain}
          />
        ))}
      </Flex>
    </Flex>
  )
}
