import React, { ReactElement, useEffect } from 'react'
import moment from 'moment'

import {
  convertFromSecondsToLarger,
  convertMilliseconds,
  getDiffInSecondsFromNow,
} from '../../utils/time'
import { MOCK_BLOCK_LIST_DATA } from '../../utils/mockData'
import List from '../../components/list/List'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBlocks } from '../../actions/blockActions'
import { Block, State as BlockState } from '../../reducers/blockReducer'
import { ROUTES } from '../../constants'
import useWindowWidth from '../../hooks/useWindowWidth'
import './DashboardBlockList.scss'
import Button from '../button/Button'
import { useHistory } from 'react-router-dom'

/*
type Block = {
  index: number
  time: number
  size: number
  tx: Array<string>
  blocktime: number
  hash: string
  txCount: number
}
 */

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
    time: `${convertFromSecondsToLarger(
      getDiffInSecondsFromNow(moment.unix(block.time).format()),
    )}`,
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

const DashboardBlockList: React.FC<{ network: string }> = ({ network }) => {
  const dispatch = useDispatch()
  const width = useWindowWidth()
  const history = useHistory()
  const blockState = useSelector(({ block }: { block: BlockState }) => block)
  const neo3List = blockState.all.filter(
    d => d.protocol === 'neo3' && d.network === 'mainnet',
  )

  useEffect(() => {
    if (!neo3List.length) dispatch(fetchBlocks('mainnet'))
  }, [dispatch, neo3List.length])

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
    <div className="multi-chain-dashboard-list">
      <div className="block-list-chain-container">
        <div>
          <div className="label-wrapper-2">
            <Button
              primary
              onClick={(): void =>
                history.push(`${ROUTES.BLOCKS.url}/neo3/${network}`)
              }
            >
              view blocks
            </Button>
          </div>
          <div className="list-wrapper">
            <List
              data={returnBlockListData(
                neo3List,
                blockState.isLoading || neo3List.length === 0,
              )}
              rowId="height"
              generateHref={(data): string =>
                `${ROUTES.BLOCK.url}/neo3/mainnet/${data.id}`
              }
              isLoading={blockState.isLoading || neo3List.length === 0}
              columns={columns}
              leftBorderColorOnRow="#D355E7"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardBlockList
