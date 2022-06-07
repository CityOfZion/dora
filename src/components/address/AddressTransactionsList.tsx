import React, { ReactElement } from 'react'
import moment from 'moment'
import { Icon } from '@iconify/react'
import DateRangeIcon from '@material-ui/icons/DateRange'
import clockIcon from '@iconify/icons-simple-line-icons/clock'

import List from '../../components/list/List'
import { ROUTES } from '../../constants'
import './AddressTransactionsList.scss'
import tokens from '../../assets/nep5/png'
import Button from '../button/Button'
import { toBigNumber } from '../../utils/formatter'

type ParsedTransaction = {
  amount: string
  id: string
  txid: () => ReactElement
  from: () => ReactElement
  to: () => ReactElement
  time: () => ReactElement
  symbol: () => ReactElement
  href: string
}

type Transaction = {
  amount: string
  block: number
  from: string
  scripthash: string
  time: number
  to: string
  txid: string
  symbol: string
  decimalamount: number
}

const mapTransactionData = (tx: Transaction): ParsedTransaction => {
  return {
    amount: toBigNumber(tx.amount).toString(),
    id: tx.txid,
    txid: (): ReactElement => (
      <div className="block-index-cell address-history-txid"> {tx.txid} </div>
    ),
    from: (): ReactElement => (
      <div className="tx-address-container">{tx.from}</div>
    ),
    to: (): ReactElement => (
      <div className="tx-address-container">{tx.to} </div>
    ),
    symbol: (): ReactElement => (
      <div className="tx-symbol-and-icon-column">
        <div> {tx.symbol === 'unknown' || !tx.symbol ? 'N/A' : tx.symbol} </div>
        {tokens[tx.symbol] && (
          <div className="symbol-icon-container">
            <img src={tokens[tx.symbol]} alt="token-logo" />
          </div>
        )}
      </div>
    ),
    time: (): ReactElement => (
      <span className="transaction-time-details-row">
        <div>
          <DateRangeIcon style={{ color: '#7698A9', fontSize: 20 }} />
          <span>{moment.unix(Number(tx.time)).format('MM-DD-YYYY')}</span>
        </div>
        <div>
          <Icon icon={clockIcon} style={{ color: '#7698A9', fontSize: 18 }} />
          <span>{moment.unix(Number(tx.time)).format('HH:mm:ss')}</span>
        </div>
      </span>
    ),
    href: '#',
  }
}

const returnBlockListData = (
  data: Array<Transaction>,
): Array<ParsedTransaction> => {
  return data.map(mapTransactionData)
}

const AddressTransactionsList: React.FC<{
  transactions: Transaction[]
  shouldRenderLoadMore: boolean
  isLoading: boolean
  networkData: {
    chain: string
    network: string
  }
  handleLoadMore: () => void
}> = ({
  transactions,
  shouldRenderLoadMore,
  handleLoadMore,
  isLoading,
  networkData,
}) => (
  <>
    <List
      data={returnBlockListData(transactions)}
      rowId="id"
      generateHref={(data): string =>
        `${ROUTES.TRANSACTION.url}/${networkData.chain}/${networkData.network}/${data.id}`
      }
      isLoading={false}
      columns={[
        {
          name: 'Transaction ID',
          accessor: 'txid',
        },

        {
          name: 'Symbol',
          accessor: 'symbol',
        },

        { name: 'From', accessor: 'from' },
        { name: 'To', accessor: 'to' },
        { name: 'Amount', accessor: 'amount' },
        { name: 'Completed on', accessor: 'time' },
      ]}
    />
    {shouldRenderLoadMore && (
      <div className="load-more-button-container">
        <Button
          disabled={isLoading}
          primary={false}
          onClick={(): void => handleLoadMore()}
        >
          load more
        </Button>
      </div>
    )}
  </>
)

export default AddressTransactionsList
