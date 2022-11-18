import { Flex } from '@chakra-ui/react'
import { StackState } from '../../reducers/transactionReducer'
import { StackArrayRow } from './StackArrayRow'
import { StackRow } from './StackRow'

type Props = {
  stack: StackState[]
  chain?: string
  names?: string[]
  keyName: string
}

export const StackPanel = ({ stack, chain, names, keyName }: Props) => {
  return (
    <Flex direction={'column'} bg={'gray'} fontWeight={500} gridRowGap={4}>
      {stack.map((it, index) => (
        <>
          {it.type === 'Array' ? (
            <StackArrayRow
              key={`${keyName}-${index}`}
              index={index}
              state={it}
              chain={chain}
              name={names?.[index]}
            />
          ) : (
            <StackRow
              key={`${keyName}-${index}`}
              index={index}
              type={it.type}
              value={String(it.value)}
              chain={chain}
              name={names?.[index]}
            />
          )}
        </>
      ))}
    </Flex>
  )
}
