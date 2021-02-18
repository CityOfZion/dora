import React, { ReactElement, useEffect } from 'react'
import moment from 'moment'

import {
  getDiffInSecondsFromNow,
  convertFromSecondsToLarger,
} from '../../utils/time'
import { MOCK_TX_LIST_DATA } from '../../utils/mockData'
import List from '../list/List'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTransactions } from '../../actions/transactionActions'
import {
  Transaction,
  State as TxState,
} from '../../reducers/transactionReducer'
import { ROUTES } from '../../constants'
import useWindowWidth from '../../hooks/useWindowWidth'

type ParsedTx = {
  time: string
  txid: React.FC<{}>
  size: string
  hash: string
}

type Props = {
  network: string
}

const mapTransactionData = (tx: Transaction): ParsedTx => {
  return {
    time: `${convertFromSecondsToLarger(
      getDiffInSecondsFromNow(moment.unix(tx.time).format()),
    )}`,
    txid: (): ReactElement => (
      <div className="txid-index-cell"> {tx.txid || tx.hash} </div>
    ),
    size: `${tx.size.toLocaleString()} Bytes`,
    hash: tx.hash || tx.txid,
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

const DashboardTransactionsList: React.FC<Props> = ({ network }) => {
  const dispatch = useDispatch()
  const width = useWindowWidth()

  const txState = useSelector(
    ({ transaction }: { transaction: TxState }) => transaction,
  )
  const { neo2List } = txState

  useEffect(() => {
    if (!neo2List.length) dispatch(fetchTransactions())
  }, [dispatch, neo2List.length])

  const columns =
    width > 768
      ? [
          { name: 'Transaction ID', accessor: 'txid' },
          { name: 'Time', accessor: 'time' },
          { name: 'Size', accessor: 'size' },
        ]
      : [
          { name: 'Transaction ID', accessor: 'txid' },
          { name: 'Size', accessor: 'size' },
        ]

  return (
    <div className="multi-chain-dashboard-list list-row-container">
      <div className="block-list-chain-container">
        <h4>Neo Legacy</h4>
        <div className="list-wrapper">
          <List
            data={returnTxListData(txState.neo2List, txState.isLoading)}
            rowId="hash"
            generateHref={(data): string =>
              `${ROUTES.TRANSACTION.url}/neo2/${network}/${data.id}`
            }
            isLoading={txState.isLoading}
            columns={columns}
            leftBorderColorOnRow="#D355E7"
          />
        </div>
      </div>
      <div className="block-list-chain-container">
        <div>
          <h4>Neo (Preview 5) </h4>
          <div className="list-wrapper">
            <List
              data={returnTxListData(txState.neo3List, txState.isLoading)}
              rowId="hash"
              generateHref={(data): string =>
                `${ROUTES.TRANSACTION.url}/neo3/testnet/${data.id}`
              }
              isLoading={txState.isLoading}
              columns={columns}
              leftBorderColorOnRow="#D355E7"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardTransactionsList
