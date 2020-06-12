import React, { ReactElement } from 'react'
import moment from 'moment'

import { Block } from '../../reducers/blockReducer'
import { ReactComponent as Calendar } from '../../assets/icons/calendar.svg'
import { ReactComponent as Clock } from '../../assets/icons/clock.svg'
import List from '../list/List'
import './BlockTransactionsList.scss'

import { BlockTransaction } from '../../reducers/transactionReducer'

type ParsedTx = {
  time: React.FC<{}>
  txid: React.FC<{}>
  size: string
  type: string
}

const mapTransactionData = (tx: BlockTransaction, block: Block): ParsedTx => {
  return {
    time: (): ReactElement => (
      <span className="transaction-time-details-row">
        <div>
          <Calendar />
          <span>{moment.unix(block.time).format('MM-DD-YYYY')}</span>
        </div>
        <div>
          <Clock />
          <span>{moment.unix(block.time).format('HH:MM:SS')}</span>
        </div>
      </span>
    ),
    txid: (): ReactElement => (
      <div className="txid-index-cell"> {tx.txid} </div>
    ),
    size: `${tx.size.toLocaleString()} Bytes`,
    type: tx.type,
  }
}

const returnTxListData = (
  data: Array<BlockTransaction>,
  block: Block,
): Array<ParsedTx> => {
  return data.map(tx => mapTransactionData(tx, block)).slice(0, 8)
}

const BlockTransactionsList: React.FC<{
  list: Array<BlockTransaction>
  block: Block
  loading: boolean
}> = ({ list, block, loading }) => {
  return (
    <div id="BlockTransactionsList">
      <List
        data={returnTxListData(list, block)}
        rowId="index"
        handleRowClick={(data): void => console.log(data)}
        isLoading={loading}
        columns={[
          { name: 'Type', accessor: 'type' },
          { name: 'Transaction ID', accessor: 'txid' },
          { name: 'Size', accessor: 'size' },
          { name: 'Completed on', accessor: 'time' },
        ]}
      />
    </div>
  )
}

export default BlockTransactionsList
