import React, { ReactElement } from 'react'
import moment from 'moment'

import List from '../../components/list/List'
import { ROUTES } from '../../constants'
import { useHistory } from 'react-router-dom'
import { ReactComponent as Calendar } from '../../assets/icons/calendar.svg'
import { ReactComponent as Clock } from '../../assets/icons/clock.svg'
import './AddressTransactionsList.scss'

type ParsedTransaction = {
  amount: string
  id: string
  txid: string
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
    txid: tx.txid,
    from: tx.from,
    to: tx.to,
    time: (): ReactElement => (
      <span className="transaction-time-details-row">
        <div>
          <Calendar />
          <span>{moment.unix(tx.time).format('MM-DD-YYYY')}</span>
        </div>
        <div>
          <Clock />
          <span>{moment.unix(tx.time).format('HH:MM:SS')}</span>
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
