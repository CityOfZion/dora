import React, { ReactElement, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { convertMilliseconds, formatSecondsAgo } from '../../utils/time'
import { MOCK_BLOCK_LIST_DATA } from '../../utils/mockData'
import List from '../../components/list/List'
import { fetchBlocks, clearList } from '../../actions/blockActions'
import { State as BlockState, Block } from '../../reducers/blockReducer'
import './Blocks.scss'
import Button from '../../components/button/Button'
import { ROUTES } from '../../constants'
import Breadcrumbs from '../../components/navigation/Breadcrumbs'
import Filter from '../../components/filter/Filter'
import Neo2 from '../../assets/icons/neo2.svg'
import Neo3 from '../../assets/icons/neo3.svg'
import useFilterState from '../../hooks/useFilterState'

type ParsedBlock = {
  time: string
  index: React.FC<{}>
  platform: React.FC<{}>
  transactions: number
  blocktime: string
  size: string
  height: number
  href: string
}

const mapBlockData = (block: Block, network?: string): ParsedBlock => {
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
    time: formatSecondsAgo(block.time),
    index: (): ReactElement => (
      <div className="block-index-cell"> {block.index.toLocaleString()} </div>
    ),
    height: block.index,
    transactions: block.txCount,
    blocktime: convertMilliseconds(block.blocktime),
    size: `${block.size.toLocaleString()} Bytes`,
    href: `${ROUTES.BLOCK.url}/${block.chain}/${network}/${block.index}`,
  }
}

const returnBlockListData = (
  data: Array<Block>,
  returnStub: boolean,
  network: string,
): Array<ParsedBlock> => {
  if (returnStub) {
    return MOCK_BLOCK_LIST_DATA.map(block => mapBlockData(block))
  } else {
    return data.map(block => mapBlockData(block, network))
  }
}

const Blocks: React.FC<{}> = () => {
  const dispatch = useDispatch()
  const blockState = useSelector(({ block }: { block: BlockState }) => block)

  function loadMore(): void {
    const nextPage = blockState.page + 1
    dispatch(fetchBlocks(nextPage))
  }
  const { selectedChain, handleSetFilterData, network } = useFilterState()
  const selectedData = (): Array<Block> => {
    switch (selectedChain) {
      case 'neo2':
        return blockState.neo2List
      case 'neo3':
        return blockState.neo3List
      default:
        return blockState.all
    }
  }

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
        <Filter
          handleFilterUpdate={(option): void => {
            handleSetFilterData({
              selectedChain: option.value,
            })
          }}
        />
        <List
          data={returnBlockListData(
            selectedData(),
            !selectedData().length,
            network,
          )}
          rowId="height"
          isLoading={!blockState.all.length}
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
