import React, { ReactElement, useEffect } from 'react'
import moment from 'moment'

import { getDiffInSecondsFromNow } from '../../utils/time'
import { MOCK_TX_LIST_DATA } from '../../utils/mockData'
import List from '../list/List'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTransactions } from '../../actions/transactionActions'
import {
  Transaction,
  State as TxState,
} from '../../reducers/transactionReducer'
import { useHistory } from 'react-router-dom'
import { ROUTES } from '../../constants'
import useWindowWidth from '../../hooks/useWindowWidth'

type ParsedTx = {
  time: string
  txid: React.FC<{}>
  size: string
  hash: string
}

const mapTransactionData = (tx: Transaction): ParsedTx => {
  return {
    time: `${getDiffInSecondsFromNow(moment(tx.time).format())} seconds ago`,
    txid: (): ReactElement => (
      <div className="txid-index-cell"> {tx.txid} </div>
    ),
    size: `${tx.size.toLocaleString()} Bytes`,
    hash: tx.txid,
  }
}

const returnTxListData = (
  data: Array<Transaction>,
  returnStub: boolean,
): Array<ParsedTx> => {
  if (returnStub) {
    return MOCK_TX_LIST_DATA.map(mapTransactionData).slice(0, 8)
  } else {
    return data.map(mapTransactionData).slice(0, 8)
  }
}

const DashboardTransactionsList: React.FC<{}> = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const width = useWindowWidth()

  const txState = useSelector(
    ({ transaction }: { transaction: TxState }) => transaction,
  )

  useEffect(() => {
    dispatch(fetchTransactions())
  }, [dispatch])

  const columns =
    width > 768
      ? [
          { name: 'Transaction ID', accessor: 'txid' },
          { name: 'Size', accessor: 'size' },
          { name: 'Time', accessor: 'time' },
        ]
      : [
          { name: 'Transaction ID', accessor: 'txid' },
          { name: 'Size', accessor: 'size' },
        ]

  return (
    <List
      data={returnTxListData(txState.list, txState.isLoading)}
      rowId="hash"
      handleRowClick={(data): void => {
        history.push(`${ROUTES.TRANSACTION.url}/${data.id}`)
      }}
      isLoading={txState.isLoading}
      columns={columns}
      leftBorderColorOnRow="#D355E7"
    />
  )
}

export default DashboardTransactionsList
