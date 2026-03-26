import React, { ReactElement, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import moment from 'moment'

import {
  convertFromSecondsToLarger,
  convertMilliseconds,
  getDiffInSecondsFromNow,
} from '../../utils/time'
import { MOCK_BLOCK_LIST_DATA } from '../../utils/mockData'
import List from '../../components/list/List'
import { fetchBlocks } from '../../actions/blockActions'
import { State as BlockState, Block } from '../../reducers/blockReducer'
import './Blocks.scss'
import { ROUTES } from '../../constants'
import Breadcrumbs from '../../components/navigation/Breadcrumbs'
import PlatformCell from '../../components/platform-cell/PlatformCell'
import useWindowWidth from '../../hooks/useWindowWidth'
import { useParams } from 'react-router-dom'
import ListPagination from '../../components/pagination/ListPagination'
import { AppThunkDispatch } from '../../store'
import useNetworkGlobalSelector from '../../hooks/useNetworkGlobalSelector'
import { usePagination } from '../../hooks/usePagination'

type ParsedBlock = {
  time: string
  index: React.FC
  platform: React.FC
  transactions: number
  blocktime: string
  size: React.FC
  height: number
  href: string
  chain: string
}

interface MatchParams extends Record<string, string | undefined> {
  chain?: string
  network?: string
}

type ReturnBlockListDataParams = {
  data: Array<Block>
  returnStub: boolean
}

type MapBlockDataParams = {
  block: Block
}

const mapBlockData = ({ block }: MapBlockDataParams): ParsedBlock => {
  return {
    chain: block.protocol || '',
    platform: (): ReactElement => (
      <PlatformCell protocol={block.protocol} network={block.network} />
    ),
    time: convertFromSecondsToLarger(
      getDiffInSecondsFromNow(moment.unix(block.time).format()),
    ),
    index: (): ReactElement => (
      <div className="block-index-cell"> {block.index.toLocaleString()} </div>
    ),
    height: block.index,
    transactions: block.txCount,
    blocktime: convertMilliseconds(block.blocktime),
    size: (): ReactElement => (
      <div className="contract-time-cell">
        {block.size.toLocaleString()} Bytes
        <ArrowForwardIcon style={{ color: '#D355E7' }} />{' '}
      </div>
    ),

    href: `${ROUTES.BLOCK.url}/${block.protocol}/${block.network}/${block.index}`,
  }
}

const returnBlockListData = ({
  data,
  returnStub,
}: ReturnBlockListDataParams): Array<ParsedBlock> => {
  if (returnStub) {
    return MOCK_BLOCK_LIST_DATA.map(block => mapBlockData({ block }))
  } else {
    return data.map(block => mapBlockData({ block }))
  }
}

const Blocks: React.FC<MatchParams> = () => {
  const dispatch = useDispatch<AppThunkDispatch>()
  const blockState = useSelector(({ block }: { block: BlockState }) => block)
  const { network } = useNetworkGlobalSelector()
  const width = useWindowWidth()
  const { perPage, page, model } = usePagination({
    loadPage,
    totalCount: blockState.totalCount,
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { chain, network: networkParam } = useParams<MatchParams>()

  function loadPage(nextPage: number): void {
    dispatch(fetchBlocks(network, nextPage))
  }

  useEffect(() => {
    dispatch(fetchBlocks(network, page))
  }, [network, page])

  const columns =
    width > 768
      ? [
          { name: 'Network', accessor: 'platform' },
          {
            name: 'Height',
            accessor: 'index',
          },
          { name: 'Time', accessor: 'time' },
          { name: 'Transactions', accessor: 'transactions' },
          { name: 'Size', accessor: 'size' },
        ]
      : [
          { name: 'Network', accessor: 'platform' },
          {
            name: 'Height',
            accessor: 'index',
          },

          { name: 'Transactions', accessor: 'transactions' },
        ]

  return (
    <div id="Blocks" className="page-container">
      <div className="list-wrapper">
        <Breadcrumbs
          crumbs={[
            {
              url: ROUTES.HOME.url,
              label: 'Home',
            },
            {
              url: '#',
              label: 'Blocks',
              active: true,
            },
          ]}
        />

        <div className="page-title-container">
          {ROUTES.BLOCKS.renderIcon()}
          <h1>{ROUTES.BLOCKS.name}</h1>
        </div>
        <List
          data={returnBlockListData({
            data: blockState.all,
            returnStub: !blockState.all.length,
          })}
          rowId="height"
          isLoading={blockState.isLoading}
          columns={columns}
          countConfig={{
            label: 'Blocks',
          }}
          leftBorderColorOnRow={(
            id: string | number | void | React.FC,
            chain: string | number | void | React.FC,
          ): string => {
            if (typeof chain === 'string') {
              interface TxColorMap {
                [key: string]: string
              }

              const txColorMap: TxColorMap = {
                neo2: '#b0eb3c',
                neo3: '#88ffad',
              }

              if (chain && txColorMap[chain || 'neo2']) {
                return txColorMap[chain || 'neo2']
              }
            }

            return ''
          }}
        />
        <div className="block-list-pagination">
          <ListPagination
            perPage={perPage}
            totalCount={blockState.totalCount}
            model={model}
            isLoading={blockState.isLoading}
          />
        </div>
      </div>
    </div>
  )
}

export default Blocks
