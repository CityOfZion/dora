import React, { ReactElement, useEffect } from 'react'
import moment from 'moment'

import { convertMilliseconds, getDiffInSecondsFromNow } from '../../utils/time'
import { MOCK_BLOCK_LIST_DATA } from '../../utils/mockData'
import List from '../../components/list/List'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBlocks, clearList } from '../../actions/blockActions'
import { State as BlockState, Block } from '../../reducers/blockReducer'
import './Blocks.scss'
import Button from '../../components/button/Button'
import { ROUTES } from '../../constants'
import Breadcrumbs from '../../components/navigation/Breadcrumbs'
import Neo2 from '../../assets/icons/neo2.svg'
import Neo3 from '../../assets/icons/neo3.svg'
import { State as NetworkState } from '../../reducers/networkReducer'

type ParsedBlock = {
  time: string
  index: React.FC<{}>
  platform: React.FC<{}>
  transactions: number
  blocktime: string
  size: string
  height: number
  chain: string
}

const mapBlockData = (block: Block): ParsedBlock => {
  return {
    platform: (): ReactElement => (
      <div className="txid-index-cell">
        {block.chain === 'neo2' ? (
          <div className="neo2-platform-cell">
            <img src={Neo2} alt="NEO 2" />
            <span>NEO 2</span>
          </div>
        ) : (
          <div className="neo3-platform-cell">
            <img src={Neo3} alt="NEO 3" />
            <span>NEO 3</span>
          </div>
        )}
      </div>
    ),
    time:
      typeof block.time === 'number'
        ? `${getDiffInSecondsFromNow(
            moment.unix(block.time).format(),
          )} seconds ago`
        : `${getDiffInSecondsFromNow(
            moment.utc(block.time).local().format(),
          )} seconds ago`,
    index: (): ReactElement => (
      <div className="block-index-cell"> {block.index.toLocaleString()} </div>
    ),
    height: block.index,
    transactions: block.txCount,
    blocktime: convertMilliseconds(block.blocktime),
    size: `${block.size.toLocaleString()} Bytes`,
    chain: block.chain || '',
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
  const blockState = useSelector(({ block }: { block: BlockState }) => block)
  const list = blockState.neo2List

  function loadMore(): void {
    const nextPage = blockState.page + 1
    dispatch(fetchBlocks(nextPage))
  }

  const sortedChainDataByDate = (): Block[] => {
    const { neo2List, neo3List } = blockState
    const combinedList = [
      ...neo2List.map((t: Block) => {
        t.chain = 'neo2'
        return t
      }),
      ...neo3List.map((t: Block) => {
        t.chain = 'neo3'
        return t
      }),
    ]
    return combinedList.sort((b: Block, a: Block) => {
      const formattedTime = (time: string | number): string =>
        typeof time === 'string'
          ? moment.utc(time).local().format()
          : moment(new Date(time * 1000)).format()

      return formattedTime(a.time).localeCompare(formattedTime(b.time))
    })
  }

  const networkState = useSelector(
    ({ network }: { network: NetworkState }) => network,
  )

  useEffect(() => {
    dispatch(fetchBlocks())

    return (): void => {
      dispatch(clearList())
    }
  }, [dispatch])

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
          data={returnBlockListData(
            sortedChainDataByDate(),
            !sortedChainDataByDate().length,
          )}
          rowId="height"
          generateHref={({ id }): string => {
            if (!blockState.isLoading) {
              const listData = returnBlockListData(
                sortedChainDataByDate(),
                !sortedChainDataByDate().length,
              )

              // eslint-disable-next-line
              const block = listData.find(b => b.height == id)
              if (block) {
                return `${ROUTES.BLOCK.url}/${block.chain || 'neo2'}/${
                  block.chain === 'neo3' ? 'testnet' : networkState.network
                }/${id}`
              }
            }
            return '#'
          }}
          isLoading={!list.length}
          columns={[
            { name: 'Platform', accessor: 'platform' },
            {
              name: 'Height',
              accessor: 'index',
            },
            { name: 'Time', accessor: 'time' },
            { name: 'Transactions', accessor: 'transactions' },
            { name: 'Size', accessor: 'size' },
          ]}
          countConfig={{
            label: 'Blocks',
            // total: list && list[0] && list[0].index,
          }}
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
