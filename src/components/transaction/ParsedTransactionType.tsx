import React, { ReactElement } from 'react'

import Invocation from '../../assets/icons/colored-invocation.svg'
import Contract from '../../assets/icons/colored-contract-transaction.svg'
import Claim from '../../assets/icons/colored-gas-claim-transaction.svg'
import './ParsedTransactionType.scss'

const parseTypeToDiplayValue = (type?: string): string => {
  switch (type) {
    case 'MinerTransaction':
      return 'Miner'
    case 'InvocationTransaction':
      return 'Invocation'
    case 'ClaimTransaction':
      return 'GAS Claim'
    case 'ContractTransaction':
      return 'Contract'
    default:
      return 'Contract'
  }
}

const parseTypeToIcon = (type?: string): ReactElement => {
  switch (type) {
    case 'InvocationTransaction':
      return <img src={Invocation} alt="invocation-icon" />
    case 'ClaimTransaction':
      return <img src={Claim} alt="claim-icon" />
    case 'ContractTransaction':
      return <img src={Contract} alt="contract-icon" />
    default:
      return <img src={Contract} alt="contract-icon" />
  }
}

type Props = {
  type?: string
}

const ParsedTransactionType: React.FC<Props> = ({ type }: Props) => (
  <div className="parsed-transaction-type-row">
    {' '}
    <div className="parsed-transaction-icon"> {parseTypeToIcon(type)}</div>
    <div className="parsed-transaction-title">
      {parseTypeToDiplayValue(type)}
    </div>
  </div>
)

export default ParsedTransactionType
