import Copy from '../copy/Copy'

import './TransactionBlock.scss'

type Props = {
  label: string
  value: string
  withCopyButton?: boolean
}

export const TransactionBlock = ({ label, value, withCopyButton }: Props) => {
  return (
    <div id="transaction-block" className="verti">
      <div className="horiz items-center label-container">
        <label>{label}</label>
        {withCopyButton && <Copy text={value} />}
      </div>
      <span>{value}</span>
    </div>
  )
}
