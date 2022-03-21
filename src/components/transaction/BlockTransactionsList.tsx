import React, { ReactElement } from 'react'

import { DetailedBlock } from '../../reducers/blockReducer'
import List from '../list/List'
import './BlockTransactionsList.scss'
import { BlockTransaction } from '../../reducers/transactionReducer'
import { ROUTES } from '../../constants'
import useWindowWidth from '../../hooks/useWindowWidth'
import ParsedTransactionType from './ParsedTransactionType'
import TransactionTime from './TransactionTime'

type ParsedTx = {
  time: React.FC<{}>
  txid: React.FC<{}>
  size: string
  type: string
  parsedType: React.FC<{}>
  hash: string
}

const mapTransactionData = (
  tx: BlockTransaction,
  block: DetailedBlock,
): ParsedTx => {
  return {
    time: (): ReactElement => <TransactionTime block_time={block.time} />,
    txid: (): ReactElement => (
      <div className="txid-index-cell"> {tx.txid} </div>
    ),
    size: `${tx.size.toLocaleString()} Bytes`,
    parsedType: (): ReactElement => <ParsedTransactionType type={tx.type} />,
    type: tx.type || 'contract',
    hash: tx.hash ? tx.hash : tx.txid,
  }
}

const returnTxListData = (
  data: Array<BlockTransaction>,
  block: DetailedBlock,
): Array<ParsedTx> => {
  return data.map(tx => mapTransactionData(tx, block))
}

const BlockTransactionsList: React.FC<{
  list: Array<BlockTransaction>
  block: DetailedBlock
  loading: boolean
  network: string
  chain: string
}> = ({ list, block, loading, network, chain }) => {
  const width = useWindowWidth()

  const columns =
    width > 768
      ? [
          { name: 'Type', accessor: 'parsedType' },
          { name: 'Transaction ID', accessor: 'txid' },
          { name: 'Size', accessor: 'size' },
          { name: 'Completed on', accessor: 'time' },
        ]
      : [
          { name: 'Type', accessor: 'parsedType' },
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
        generateHref={(data): string =>
          `${ROUTES.TRANSACTION.url}/${chain}/${network}/${data.id}`
        }
        isLoading={loading}
        columns={columns}
        leftBorderColorOnRow={(
          id: string | number | void | React.FC<{}>,
        ): string => {
          const listData = returnTxListData(list, block)
          const transaction = listData.find(tx => tx.hash === id)
          if (transaction) {
            switch (transaction.type) {
              case 'MinerTransaction':
                return '#FEDD5B'
              case 'InvocationTransaction':
                return '#D355E7'
              case 'ClaimTransaction':
                return '#00CBFF'
              case 'ContractTransaction':
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
