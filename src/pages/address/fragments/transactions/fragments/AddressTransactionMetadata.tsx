import React from 'react'
import { toBigNumber } from '../../../../../utils/formatter'
import { AddressTransaction } from '../AddressTransaction'

type Props = {
  transaction: AddressTransaction
}

const formatFee = (value: string) => `${toBigNumber(value).toFixed(4)} GAS`

const AddressTransactionMetadata: React.FC<Props> = ({ transaction }) => {
  return (
    <div className="address-transactions__table--status-details">
      <div className="address-transactions__table--balloon address-transactions__table--status-balloon">
        Block: <span>{transaction.block}</span>
      </div>
      <div className="address-transactions__table--balloon address-transactions__table--status-balloon">
        Network Fee: <span>{formatFee(transaction.netfee)}</span>
      </div>
      <div className="address-transactions__table--balloon address-transactions__table--status-balloon">
        System Fee: <span>{formatFee(transaction.sysfee)}</span>
      </div>
    </div>
  )
}

export default AddressTransactionMetadata
