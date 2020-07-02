import React, { ReactElement } from 'react'
import moment from 'moment'
import { useHistory } from 'react-router-dom'

import { Block } from '../../reducers/blockReducer'
import { ReactComponent as Calendar } from '../../assets/icons/calendar.svg'
import { ReactComponent as Clock } from '../../assets/icons/clock.svg'
import List from '../list/List'
import './BlockTransactionsList.scss'
import { BlockTransaction } from '../../reducers/transactionReducer'
import { ROUTES, TRANSACTION_TYPES } from '../../constants'
import useWindowWidth from '../../hooks/useWindowWidth'

type ParsedTx = {
  time: React.FC<{}>
  txid: React.FC<{}>
  size: string
  type: string
  hash: string
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
    type: TRANSACTION_TYPES[tx.type].label || '',
    hash: tx.txid,
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
  const history = useHistory()
  const width = useWindowWidth()

  const columns =
    width > 768
      ? [
          { name: 'Type', accessor: 'type' },
          { name: 'Transaction ID', accessor: 'txid' },
          { name: 'Size', accessor: 'size' },
          { name: 'Completed on', accessor: 'time' },
        ]
      : [
          { name: 'Type', accessor: 'type' },
          {
            name: 'Transaction ID',
            accessor: 'txid',
            style: { minWidth: '100px' },
          },
          { name: 'Size', accessor: 'size' },
        ]

  return (
    <div id="BlockTransactionsList">
      <List
        data={returnTxListData(list, block)}
        rowId="hash"
        handleRowClick={(data): void => {
          history.push(`${ROUTES.TRANSACTION.url}/${data.id}`)
        }}
        isLoading={loading}
        columns={columns}
        leftBorderColorOnRow={(
          id: string | number | void | React.FC<{}>,
        ): string => {
          const listData = returnTxListData(list, block)
          const transaction = listData.find(tx => tx.hash === id)
          if (transaction) {
            switch (transaction.type) {
              case 'Miner':
                return '#FEDD5B'
              case 'Invocation':
                return '#D355E7'
              case 'Claim':
                return '#00CBFF'
              case 'Contract':
                return '#4CFFB3'
              default:
                return ''
            }
          }
          return ''
        }}
      />
    </div>
  )
}

export default BlockTransactionsList
