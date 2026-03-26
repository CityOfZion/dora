import React, { ReactElement, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { MOCK_TX_LIST_DATA } from '../../utils/mockData'
import List from '../../components/list/List'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTransactions } from '../../actions/transactionActions'
import './Transactions.scss'
import { ROUTES } from '../../constants'
import {
  Transaction,
  State as TxState,
} from '../../reducers/transactionReducer'
import Breadcrumbs from '../../components/navigation/Breadcrumbs'
import PlatformCell from '../../components/platform-cell/PlatformCell'
import useWindowWidth from '../../hooks/useWindowWidth'
import TransactionTime from '../../components/transaction/TransactionTime'
import ListPagination from '../../components/pagination/ListPagination'
import { AppThunkDispatch } from '../../store'
import useNetworkGlobalSelector from '../../hooks/useNetworkGlobalSelector'
import { usePagination } from '../../hooks/usePagination'

type ParsedTx = {
  time: React.FC
  txid: React.FC
  size: string
  hash: string
  platform: React.FC
  chain: string
  href: string
}

interface MatchParams extends Record<string, string | undefined> {
  chain?: string
  network?: string
}

type MapTransactionDataParams = {
  tx: Transaction
}

type ReturnTxListDataParams = {
  data: Array<Transaction>
  returnStub: boolean
}

const mapTransactionData = ({ tx }: MapTransactionDataParams): ParsedTx => {
  const hash = tx.hash || tx.txid

  return {
    platform: (): ReactElement => (
      <PlatformCell protocol={tx.protocol} network={tx.network} />
    ),
    time: (): ReactElement => <TransactionTime block_time={tx.time} />,
    txid: (): ReactElement => <div className="txid-index-cell"> {hash} </div>,
    size: `${tx.size.toLocaleString()} Bytes`,
    hash: hash,
    chain: tx.protocol || '',
    href: `${ROUTES.TRANSACTION.url}/${tx.protocol}/${tx.network}/${hash}`,
  }
}

const returnTxListData = ({
  data,
  returnStub,
}: ReturnTxListDataParams): Array<ParsedTx> => {
  if (returnStub) {
    return MOCK_TX_LIST_DATA.map(tx => mapTransactionData({ tx }))
  } else {
    return data.map(tx => mapTransactionData({ tx }))
  }
}

const Transactions: React.FC = () => {
  const dispatch = useDispatch<AppThunkDispatch>()
  const width = useWindowWidth()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { chain, network: networkParam } = useParams<MatchParams>()
  const transactionState = useSelector(
    ({ transaction }: { transaction: TxState }) => transaction,
  )
  const { network } = useNetworkGlobalSelector()
  const { model, perPage, page } = usePagination({
    loadPage,
    totalCount: transactionState.totalCount,
  })

  function loadPage(nextPage: number): void {
    dispatch(fetchTransactions(network, nextPage))
  }

  useEffect(() => {
    dispatch(fetchTransactions(network, page))
  }, [network, page])

  const columns =
    width > 768
      ? [
          { name: 'Network', accessor: 'platform' },
          { name: 'Transaction ID', accessor: 'txid' },
          { name: 'Size', accessor: 'size' },
          { name: 'Completed on', accessor: 'time' },
        ]
      : [
          { name: 'Network', accessor: 'platform' },
          { name: 'Transaction ID', accessor: 'txid' },
          { name: 'Size', accessor: 'size' },
        ]

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
          data={returnTxListData({
            data: transactionState.all,
            returnStub: !transactionState.all.length,
          })}
          rowId="hash"
          isLoading={transactionState.isLoading}
          columns={columns}
          countConfig={{
            label: 'Transactions',
          }}
          leftBorderColorOnRow={(
            id: string | number | void | React.FC,
            chain: string | number | void | React.FC,
          ): string => {
            if (typeof chain === 'string') {
              interface TxColorMap {
                [key: string]: string
              }

              const txColorMap: TxColorMap = {
                neo2: '#b0eb3c',
                neo3: '#88ffad',
              }

              if (chain && txColorMap[chain || 'neo2']) {
                return txColorMap[chain || 'neo2']
              }
            }

            return ''
          }}
        />
        <div className="transaction-list-pagination">
          <ListPagination
            perPage={perPage}
            totalCount={transactionState.totalCount}
            model={model}
            isLoading={transactionState.isLoading}
          />
        </div>
      </div>
    </div>
  )
}

export default Transactions
