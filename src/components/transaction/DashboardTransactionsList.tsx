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
import Button from '../button/Button'
import { useHistory } from 'react-router-dom'

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
  const history = useHistory()
  const txState = useSelector(
    ({ transaction }: { transaction: TxState }) => transaction,
  )
  const { all } = txState
  const neo3List = all.filter(
    d => d.protocol === 'neo3' && d.network === 'mainnet',
  )

  useEffect(() => {
    if (!neo3List.length) dispatch(fetchTransactions('mainnet'))
  }, [dispatch, neo3List.length])

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
    <div className="multi-chain-dashboard-list">
      <div className="block-list-chain-container">
        <div>
          <div className="label-wrapper-2">
            <Button
              primary
              onClick={(): void =>
                history.push(`${ROUTES.TRANSACTIONS.url}/neo3/${network}`)
              }
            >
              view transactions
            </Button>
          </div>
          <div className="list-wrapper">
            <List
              data={returnTxListData(neo3List, txState.isLoading)}
              rowId="hash"
              generateHref={(data): string =>
                `${ROUTES.TRANSACTION.url}/neo3/mainnet/${data.id}`
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
