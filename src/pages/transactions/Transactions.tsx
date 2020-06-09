import React, { ReactElement, useEffect } from 'react'
import moment from 'moment'

import { getDiffInSecondsFromNow } from '../../utils/time'
import { MOCK_TX_LIST_DATA } from '../../utils/mockData'
import List from '../../components/list/List'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTransactions, clearList } from '../../actions/transactionActions'
import './Transactions.scss'
import Button from '../../components/button/Button'
import { ROUTES } from '../../constants'
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
    return MOCK_TX_LIST_DATA.map(mapTransactionData)
  } else {
    return data.map(mapTransactionData)
  }
}

const Transactions: React.FC<{}> = () => {
  const dispatch = useDispatch()

  const transactionState = useSelector(
    ({ transaction }: { transaction: TxState }) => transaction,
  )

  function loadMore(): void {
    dispatch(fetchTransactions(transactionState.cursor))
  }

  useEffect(() => {
    dispatch(fetchTransactions())
    return (): void => {
      dispatch(clearList())
    }
  }, [dispatch])

  return (
    <div id="Transactions" className="page-container">
      <div className="list-wrapper">
        <div className="page-title-container">
          {ROUTES.TRANSACTIONS.renderIcon()}
          <h1>{ROUTES.TRANSACTIONS.name}</h1>
        </div>
        <List
          data={returnTxListData(
            transactionState.list,
            !transactionState.list.length,
          )}
          rowId="index"
          handleRowClick={(data): void => console.log(data)}
          isLoading={!transactionState.list.length}
          columns={[
            { name: 'Transaction ID', accessor: 'txid' },
            { name: 'Size', accessor: 'size' },
            { name: 'Time', accessor: 'time' },
          ]}
        />
        <div className="load-more-button-container">
          <Button
            disabled={transactionState.isLoading}
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

export default Transactions
