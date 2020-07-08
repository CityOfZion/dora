import React, { ReactElement, useEffect } from 'react'
import moment from 'moment'

import { convertMilliseconds, getDiffInSecondsFromNow } from '../../utils/time'
import { MOCK_BLOCK_LIST_DATA } from '../../utils/mockData'
import List from '../../components/list/List'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBlocks } from '../../actions/blockActions'
import { State as BlockState } from '../../reducers/blockReducer'
import './Blocks.scss'
import Button from '../../components/button/Button'
import { ROUTES } from '../../constants'
import { useHistory } from 'react-router-dom'

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
    height: block.index,
    transactions: block.txCount,
    blocktime: convertMilliseconds(block.blocktime),
    size: `${block.size.toLocaleString()} Bytes`,
  }
}

const returnBlockListData = (
  data: Array<Block>,
  returnStub: boolean,
): Array<ParsedBlock> => {
  if (returnStub) {
    return MOCK_BLOCK_LIST_DATA.map(mapBlockData)
  } else {
    return data.map(mapBlockData)
  }
}

const Blocks: React.FC<{}> = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const blockState = useSelector(({ block }: { block: BlockState }) => block)

  function loadMore(): void {
    const nextPage = blockState.page + 1
    dispatch(fetchBlocks(nextPage))
  }

  useEffect(() => {
    dispatch(fetchBlocks())
  }, [dispatch])

  return (
    <div id="Blocks" className="page-container">
      <div className="list-wrapper">
        <div className="page-title-container">
          {ROUTES.BLOCKS.renderIcon()}
          <h1>{ROUTES.BLOCKS.name}</h1>
        </div>
        <List
          data={returnBlockListData(blockState.list, !blockState.list.length)}
          rowId="height"
          handleRowClick={(data): void => {
            history.push(`${ROUTES.BLOCK.url}/${data.id}`)
          }}
          isLoading={!blockState.list.length}
          columns={[
            {
              name: 'Height',
              accessor: 'index',
            },
            { name: 'Time', accessor: 'time' },
            { name: 'Transactions', accessor: 'transactions' },
            { name: 'Size', accessor: 'size' },
          ]}
        />
        <div className="load-more-button-container">
          <Button
            disabled={blockState.isLoading}
            primary={false}
            onClick={(): void => loadMore()}
          >
            load more
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Blocks
