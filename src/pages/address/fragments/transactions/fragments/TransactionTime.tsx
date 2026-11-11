import React from 'react'
import calendar from '@iconify/icons-simple-line-icons/calendar'
import { Icon } from '@iconify/react'
import moment from 'moment'
import clock from '@iconify/icons-simple-line-icons/clock'

const iconStyle: React.CSSProperties = {
  color: '#7698a9',
  fontSize: 14,
  marginRight: 10,
  marginLeft: 10,
  transform: 'translateY(-1.5px)',
}

type Props = {
  time: number
}

const TransactionTime: React.FC<Props> = (props: Props) => {
  const { time } = props

  return (
    <div className="horiz">
      <Icon icon={calendar} style={iconStyle} />
      {moment.unix(time).format('MM-DD-YYYY')}
      <Icon icon={clock} style={iconStyle} />
      {moment.unix(time).format('HH:mm:ss')}
    </div>
  )
}

export default TransactionTime
