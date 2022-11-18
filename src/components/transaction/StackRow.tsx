import { Flex, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { TX_STATE_TYPE_MAPPINGS } from '../../constants'
import Copy from '../copy/Copy'
import { TypeConverter } from './TypeConverter'

type Props = {
  index: number
  name?: string
  type: string
  value: string
  chain?: string
}

export const StackRow = ({ index, name, type, value, chain }: Props) => {
  const [stackValue, setStackValue] = useState(value)

  const typeState = TX_STATE_TYPE_MAPPINGS[type]

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
          {TX_STATE_TYPE_MAPPINGS[type] && (
            <Flex
              py={1}
              px={3}
              mx={1}
              fontSize={'xs'}
              bg={TX_STATE_TYPE_MAPPINGS[type]?.color}
              color={'medium-grey-blue'}
            >
              {type}
            </Flex>
          )}

          {typeState && (
            <TypeConverter
              value={String(value)}
              type={type}
              options={typeState.options}
              chain={chain}
              handleValue={setStackValue}
            />
          )}
        </Flex>
      </Flex>

      <Flex px={7} py={2} bg={'white-100'} alignItems={'center'} minHeight={5}>
        <Text fontSize={'sm'} fontWeight={400} flex={1} color={'grey'}>
          {stackValue}
        </Text>

        <Copy text={stackValue} />
      </Flex>
    </Flex>
  )
}
