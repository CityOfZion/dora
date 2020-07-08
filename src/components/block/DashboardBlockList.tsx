import React, { ReactElement, useEffect } from 'react'
import moment from 'moment'

import { convertMilliseconds, getDiffInSecondsFromNow } from '../../utils/time'
import { MOCK_BLOCK_LIST_DATA } from '../../utils/mockData'
import List from '../../components/list/List'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBlocks } from '../../actions/blockActions'
import { State as BlockState } from '../../reducers/blockReducer'
import { ROUTES } from '../../constants'
import { useHistory } from 'react-router-dom'
import useWindowWidth from '../../hooks/useWindowWidth'
import './DashboardBlockList.scss'

type Block = {
  index: number
  time: number
  size: number
  tx: Array<string>
  blocktime: number
  hash: string
  txCount: number
}

type ParsedBlock = {
  time: string
  index: React.FC<{}>
  transactions: number
  blocktime: string
  size: string
  height: number
}

const mapBlockData = (block: Block): ParsedBlock => {
  return {
    time: `${getDiffInSecondsFromNow(
      moment.unix(block.time).format(),
    )} seconds ago`,
    index: (): ReactElement => (
      <div className="block-index-cell"> {block.index.toLocaleString()} </div>
    ),
    transactions: block.txCount,
    blocktime: convertMilliseconds(block.blocktime),
    size: `${block.size.toLocaleString()} Bytes`,
    height: block.index,
  }
}

const returnBlockListData = (
  data: Array<Block>,
  returnStub: boolean,
): Array<ParsedBlock> => {
  if (returnStub) {
    return MOCK_BLOCK_LIST_DATA.map(mapBlockData).slice(0, 8)
  } else {
    return data.map(mapBlockData).slice(0, 8)
  }
}

const DashboardBlockList: React.FC<{}> = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const width = useWindowWidth()

  const blockState = useSelector(({ block }: { block: BlockState }) => block)

  useEffect(() => {
    dispatch(fetchBlocks())
  }, [dispatch])

  const columns =
    width > 768
      ? [
          {
            name: 'Index',
            accessor: 'index',
            class: 'pink-border-left',
          },
          { name: 'Time', accessor: 'time' },
          { name: 'Transactions', accessor: 'transactions' },
          { name: 'Size', accessor: 'size' },
        ]
      : [
          {
            name: 'Index',
            accessor: 'index',
          },

          { name: 'Transactions', accessor: 'transactions' },
          { name: 'Size', accessor: 'size' },
        ]

  return (
    <List
      data={returnBlockListData(blockState.list, blockState.isLoading)}
      rowId="height"
      handleRowClick={(data): void => {
        history.push(`${ROUTES.BLOCK.url}/${data.id}`)
      }}
      isLoading={blockState.isLoading}
      columns={columns}
      leftBorderColorOnRow="#D355E7"
    />
  )
}

export default DashboardBlockList
