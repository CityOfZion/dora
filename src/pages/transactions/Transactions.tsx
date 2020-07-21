import React, { ReactElement, useEffect } from 'react'
import moment from 'moment'

import { getDiffInSecondsFromNow } from '../../utils/time'
import { MOCK_TX_LIST_DATA } from '../../utils/mockData'
import List from '../../components/list/List'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTransactions } from '../../actions/transactionActions'
import './Transactions.scss'
import Button from '../../components/button/Button'
import { ROUTES } from '../../constants'
import {
  Transaction,
  State as TxState,
} from '../../reducers/transactionReducer'
import { useHistory } from 'react-router-dom'
import Breadcrumbs from '../../components/navigation/Breadcrumbs'

type ParsedTx = {
  time: string
  txid: React.FC<{}>
  size: string
  hash: string
}

const mapTransactionData = (tx: Transaction): ParsedTx => {
  return {
    time: `${getDiffInSecondsFromNow(
      moment.unix(tx.time).format(),
    ).toLocaleString()} seconds ago`,
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
    return MOCK_TX_LIST_DATA.map(mapTransactionData)
  } else {
    return data.map(mapTransactionData)
  }
}

const Transactions: React.FC<{}> = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const transactionState = useSelector(
    ({ transaction }: { transaction: TxState }) => transaction,
  )

  function loadMore(): void {
    dispatch(fetchTransactions(transactionState.cursor))
  }

  useEffect(() => {
    dispatch(fetchTransactions())
  }, [dispatch])

  return (
    <div id="Transactions" className="page-container">
      <div className="list-wrapper">
        <Breadcrumbs
          crumbs={[
            {
              url: ROUTES.HOME.url,
              label: 'Home',
            },
            {
              url: '#',
              label: 'Transactions',
              active: true,
            },
          ]}
        />

        <div className="page-title-container">
          {ROUTES.TRANSACTIONS.renderIcon()}
          <h1>{ROUTES.TRANSACTIONS.name}</h1>
        </div>
        <List
          data={returnTxListData(
            transactionState.list,
            !transactionState.list.length,
          )}
          rowId="hash"
          handleRowClick={(data): void =>
            history.push(`${ROUTES.TRANSACTION.url}/${data.id}`)
          }
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
