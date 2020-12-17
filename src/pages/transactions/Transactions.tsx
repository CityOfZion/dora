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
import Neo2 from '../../assets/icons/neo2.svg'
import Neo3 from '../../assets/icons/neo3.svg'
import { State as NetworkState } from '../../reducers/networkReducer'

type ParsedTx = {
  time: string
  txid: React.FC<{}>
  size: string
  hash: string
  type: string
  parsedType: React.FC<{}>
  platform: React.FC<{}>
  chain: string
}

const mapTransactionData = (tx: Transaction): ParsedTx => {
  return {
    platform: (): ReactElement => (
      <div className="txid-index-cell">
        {tx.chain === 'neo2' ? (
          <div className="neo2-platform-cell">
            <img src={Neo2} alt="NEO 2" />
            <span>NEO 2</span>
          </div>
        ) : (
          <div className="neo3-platform-cell">
            <img src={Neo3} alt="NEO 3" />
            <span>NEO 3</span>
          </div>
        )}
      </div>
    ),
    time:
      typeof tx.time === 'number'
        ? `${getDiffInSecondsFromNow(
            moment.unix(tx.time).format(),
          ).toLocaleString()} seconds ago`
        : `${getDiffInSecondsFromNow(moment(tx.time).format())} seconds ago`,
    txid: (): ReactElement => (
      <div className="txid-index-cell"> {tx.hash || tx.txid} </div>
    ),
    size: `${tx.size.toLocaleString()} Bytes`,
    hash: tx.hash || tx.txid,
    type: tx.type,
    parsedType: (): ReactElement => (
      <ParsedTransactionType type={tx.type || 'ContractTransaction'} />
    ),
    chain: tx.chain || '',
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

  const networkState = useSelector(
    ({ network }: { network: NetworkState }) => network,
  )
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

  const sortedChainDataByDate = (): Transaction[] => {
    const { neo2List, neo3List } = transactionState
    const combinedList = [
      ...neo2List.map((t: Transaction) => {
        t.chain = 'neo2'
        return t
      }),
      ...neo3List.map((t: Transaction) => {
        t.chain = 'neo3'
        return t
      }),
    ]
    return combinedList.sort((b: Transaction, a: Transaction) => {
      const formattedTime = (time: string | number): string =>
        typeof time === 'string'
          ? moment(time).format()
          : moment(new Date(time * 1000)).format()

      return formattedTime(a.time).localeCompare(formattedTime(b.time))
    })
  }
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
            sortedChainDataByDate(),
            !sortedChainDataByDate().length,
          )}
          rowId="hash"
          generateHref={({ id }): string => {
            const listData = returnTxListData(
              sortedChainDataByDate(),
              !sortedChainDataByDate().length,
            )
            const transaction = listData.find(tx => tx.hash === id)
            if (transaction) {
              return `${ROUTES.TRANSACTION.url}/${
                transaction.chain || 'neo2'
              }/${networkState.network}/${id}`
            }
            return '#'
          }}
          isLoading={!transactionState.neo2List.length}
          columns={[
            { name: 'Platform', accessor: 'platform' },
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
              sortedChainDataByDate(),
              !sortedChainDataByDate().length,
            )
            const transaction = listData.find(tx => tx.hash === id)
            interface TxColorMap {
              [key: string]: string
            }
            const txColorMap: TxColorMap = {
              neo2: '#A5C9C7',
              neo3: '#4CFFB3',
            }

            if (transaction && txColorMap[transaction.chain]) {
              return txColorMap[transaction.chain]
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
