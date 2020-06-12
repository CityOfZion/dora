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

type ParsedTx = {
  time: string
  txid: React.FC<{}>
  size: string
}

const mapTransactionData = (tx: Transaction): ParsedTx => {
  return {
    time: `${getDiffInSecondsFromNow(moment(tx.time).format())} seconds ago`,
    txid: (): ReactElement => (
      <div className="txid-index-cell"> {tx.txid} </div>
    ),
    size: `${tx.size.toLocaleString()} Bytes`,
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

  const txState = useSelector(
    ({ transaction }: { transaction: TxState }) => transaction,
  )

  useEffect(() => {
    dispatch(fetchTransactions())
  }, [dispatch])

  return (
    <List
      data={returnTxListData(txState.list, txState.isLoading)}
      rowId="index"
      handleRowClick={(data): void => console.log(data)}
      isLoading={txState.isLoading}
      columns={[
        { name: 'Transaction ID', accessor: 'txid' },
        { name: 'Size', accessor: 'size' },
        { name: 'Time', accessor: 'time' },
      ]}
    />
  )
}

export default DashboardTransactionsList
