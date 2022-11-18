import { Box } from '@chakra-ui/react'
import { StackState } from '../../reducers/transactionReducer'
import ExpandingPanel from '../panel/ExpandingPanel'
import { StackPanel } from './StackPanel'

type Props = {
  stack: StackState[]
  chain?: string
}

export const StackResult = ({ stack, chain }: Props) => {
  return (
    <Box my={3}>
      <ExpandingPanel title="STACK RESULT" open={false}>
        <StackPanel stack={stack} chain={chain} keyName={'stack-result'} />
      </ExpandingPanel>
    </Box>
  )
}
