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
import Breadcrumbs from '../../components/navigation/Breadcrumbs'
import ParsedTransactionType from '../../components/transaction/ParsedTransactionType'

type ParsedTx = {
  time: string
  txid: React.FC<{}>
  size: string
  hash: string
  type: string
  parsedType: React.FC<{}>
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
    type: tx.type,
    parsedType: (): ReactElement => <ParsedTransactionType type={tx.type} />,
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
    const nextPage = transactionState.page + 1
    dispatch(fetchTransactions(nextPage))
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
            transactionState.neo2List,
            !transactionState.neo2List.length,
          )}
          rowId="hash"
          generateHref={(data): string =>
            `${ROUTES.TRANSACTION.url}/${data.id}`
          }
          isLoading={!transactionState.neo2List.length}
          columns={[
            { name: 'Type', accessor: 'parsedType' },
            { name: 'Transaction ID', accessor: 'txid' },
            { name: 'Size', accessor: 'size' },
            { name: 'Time', accessor: 'time' },
          ]}
          countConfig={{
            label: 'Transactions',
          }}
          leftBorderColorOnRow={(
            id: string | number | void | React.FC<{}>,
          ): string => {
            const listData = returnTxListData(
              transactionState.neo2List,
              !transactionState.neo2List.length,
            )
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
                  return 'transparent'
              }
            }
            return ''
          }}
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
