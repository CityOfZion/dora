import moment from 'moment'
import React from 'react'
import DateRangeIcon from '@material-ui/icons/DateRange'
import clockIcon from '@iconify/icons-simple-line-icons/clock'
import { Icon } from '@iconify/react'

export type TransactionTimeProps = {
  block_time?: number
}

const TransactionTime: React.FC<TransactionTimeProps> = ({
  block_time,
}: TransactionTimeProps) => (
  <span className="transaction-time-details-row">
    <div>
      <Icon icon={clockIcon} style={{ color: '#7698A9', fontSize: 18 }} />
      <span>{moment.unix(block_time || 0).format('HH:mm:ss')}</span>
    </div>
    <div>
      <DateRangeIcon style={{ color: '#7698A9', fontSize: 20 }} />
      <span>{moment.unix(block_time || 0).format('MM-DD-YYYY')}</span>
    </div>
  </span>
)

export default TransactionTime
