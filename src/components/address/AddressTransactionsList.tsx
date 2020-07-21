import React, { ReactElement } from 'react'
import moment from 'moment'
import { Icon } from '@iconify/react'
import DateRangeIcon from '@material-ui/icons/DateRange'
import clockIcon from '@iconify/icons-simple-line-icons/clock'

import List from '../../components/list/List'
import { ROUTES } from '../../constants'
import { useHistory } from 'react-router-dom'
import './AddressTransactionsList.scss'

type ParsedTransaction = {
  amount: string
  id: string
  txid: () => ReactElement
  from: string
  to: string
  time: () => ReactElement
}

type Transaction = {
  amount: string
  block: number
  from: string
  scripthash: string
  time: number
  to: string
  txid: string
}
const mapTransactionData = (tx: Transaction): ParsedTransaction => {
  return {
    amount: tx.amount,
    id: tx.txid,
    txid: (): ReactElement => (
      <div className="block-index-cell address-history-txid"> {tx.txid} </div>
    ),
    from: tx.from,
    to: tx.to,
    time: (): ReactElement => (
      <span className="transaction-time-details-row">
        <div>
          <DateRangeIcon style={{ color: '#7698A9', fontSize: 20 }} />
          <span>{moment.unix(tx.time).format('MM-DD-YYYY')}</span>
        </div>
        <div>
          <Icon icon={clockIcon} style={{ color: '#7698A9', fontSize: 18 }} />
          <span>{moment.unix(tx.time).format('hh:mm:ss')}</span>
        </div>
      </span>
    ),
  }
}

const returnBlockListData = (
  data: Array<Transaction>,
): Array<ParsedTransaction> => {
  return data.map(mapTransactionData)
}

const AddressTransactionsList: React.FC<{ transactions: Transaction[] }> = ({
  transactions,
}) => {
  const history = useHistory()
  return (
    <List
      data={returnBlockListData(transactions)}
      rowId="id"
      handleRowClick={(data): void => {
        history.push(`${ROUTES.TRANSACTION.url}/${data.id}`)
      }}
      isLoading={false}
      columns={[
        {
          name: 'Transaction ID',
          accessor: 'txid',
        },
        { name: 'Sent', accessor: 'amount' },
        { name: 'From', accessor: 'from' },
        { name: 'To', accessor: 'to' },
        { name: 'Completed on', accessor: 'time' },
      ]}
    />
  )
}

export default AddressTransactionsList
