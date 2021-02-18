import React, { ReactElement, useEffect } from 'react'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import moment from 'moment'

import {
  getDiffInSecondsFromNow,
  convertFromSecondsToLarger,
} from '../../utils/time'
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
import PlatformCell from '../../components/platform-cell/PlatformCell'
import useFilterState from '../../hooks/useFilterState'
import Filter from '../../components/filter/Filter'
import useWindowWidth from '../../hooks/useWindowWidth'

type ParsedTx = {
  time: React.FC<{}>
  txid: React.FC<{}>
  size: string
  hash: string
  type: string
  parsedType: React.FC<{}>
  platform: React.FC<{}>
  chain: string
  href: string
}

const mapTransactionData = (tx: Transaction, network?: string): ParsedTx => {
  return {
    platform: (): ReactElement => <PlatformCell chain={tx.chain} />,
    time: (): ReactElement => (
      <div className="contract-time-cell">
        {convertFromSecondsToLarger(
          getDiffInSecondsFromNow(moment.unix(tx.time).format()),
        )}
        <ArrowForwardIcon style={{ color: '#D355E7' }} />{' '}
      </div>
    ),
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
    href: `${ROUTES.TRANSACTION.url}/${tx.chain}/${network}/${
      tx.hash || tx.txid
    }`,
  }
}

const returnTxListData = (
  data: Array<Transaction>,
  returnStub: boolean,
  network: string,
): Array<ParsedTx> => {
  if (returnStub) {
    return MOCK_TX_LIST_DATA.map(tx => mapTransactionData(tx))
  } else {
    return data.map(tx => mapTransactionData(tx, network))
  }
}

const Transactions: React.FC<{}> = () => {
  const dispatch = useDispatch()
  const width = useWindowWidth()

  const transactionState = useSelector(
    ({ transaction }: { transaction: TxState }) => transaction,
  )

  function loadMore(): void {
    const nextPage = transactionState.page + 1
    dispatch(fetchTransactions(nextPage))
  }

  const { selectedChain, handleSetFilterData, network } = useFilterState()

  const selectedData = (): Array<Transaction> => {
    switch (selectedChain) {
      case 'neo2':
        return transactionState.neo2List
      case 'neo3':
        return transactionState.neo3List
      default:
        return transactionState.all
    }
  }

  useEffect(() => {
    dispatch(fetchTransactions())

    return (): void => {
      dispatch(clearList())
    }
  }, [dispatch])

  const columns =
    width > 768
      ? [
          { name: 'Platform', accessor: 'platform' },
          { name: 'Type', accessor: 'parsedType' },
          { name: 'Transaction ID', accessor: 'txid' },
          { name: 'Size', accessor: 'size' },
          { name: 'Time', accessor: 'time' },
        ]
      : [
          { name: 'Platform', accessor: 'platform' },
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
        <Filter
          handleFilterUpdate={(option): void => {
            handleSetFilterData({
              selectedChain: option.value,
            })
          }}
        />
        <List
          data={returnTxListData(
            selectedData(),
            !selectedData().length,
            network,
          )}
          rowId="hash"
          isLoading={!transactionState.all.length}
          columns={columns}
          countConfig={{
            label: 'Transactions',
          }}
          leftBorderColorOnRow={(
            id: string | number | void | React.FC<{}>,
            chain: string | number | void | React.FC<{}>,
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
