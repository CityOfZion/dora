import React, { ReactElement, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { MOCK_CONTRACTS_INVOCATIONS_DATA } from '../../utils/mockData'
import List from '../../components/list/List'
import './ContractsInvocations.scss'
import { State as ContractState } from '../../reducers/contractReducer'
import { fetchContractsInvocations } from '../../actions/contractActions'
import { ReactComponent as ArrowUp } from '../../assets/icons/arrow-upward.svg'
import { ReactComponent as ArrowDown } from '../../assets/icons/arrow-downward.svg'
import useWindowWidth from '../../hooks/useWindowWidth'

type Invocation = {
  name: string
  hash: string
  count: number
  change: string
}

type ParsedInvocation = {
  contract: React.FC<{}>
  count: React.FC<{}>
  change: React.FC<{}>
}

const mapInvocationData = (
  invocation: Invocation,
  total: number,
  position: number,
): ParsedInvocation => {
  const percentage = Math.floor((invocation.count / total) * 100)
  return {
    contract: (): ReactElement => (
      <div className="invocation-name-container">
        <div className="invocation-position">{position + 1}</div>
        <div className="invocation-name">{invocation.name}</div>
        <div className="invocation-count-bar">
          <div
            className="invocation-count-bar-count-color"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    ),
    count: (): ReactElement => (
      <div className="invocation-count">
        {invocation.count.toLocaleString()}
      </div>
    ),
    change: (): ReactElement => (
      <div className="invocation-change">
        {invocation.change[0] === '+' ? <ArrowUp /> : <ArrowDown />}
        {invocation.change}%
      </div>
    ),
  }
}

const returnBlockListData = (
  data: Array<Invocation>,
  returnStub: boolean,
): Array<ParsedInvocation> => {
  if (returnStub) {
    return MOCK_CONTRACTS_INVOCATIONS_DATA.map((invocation, i) =>
      mapInvocationData(invocation, 0, i),
    ).slice(0, 5)
  } else {
    const totalTransactions =
      data.length && data.reduce((a, b) => a + b.count, 0)
    return data
      .map((invocation, i) =>
        mapInvocationData(invocation, totalTransactions, i),
      )
      .slice(0, 5)
  }
}

const ContractsInvocations: React.FC<{}> = () => {
  const dispatch = useDispatch()
  const contractState = useSelector(
    ({ contract }: { contract: ContractState }) => contract,
  )
  const { contractsInvocations, isLoading } = contractState
  const width = useWindowWidth()

  useEffect(() => {
    dispatch(fetchContractsInvocations())
  }, [dispatch])

  const columns =
    width > 768
      ? [
          {
            name: 'Contracts',
            accessor: 'contract',
          },
          { name: 'Transactions', accessor: 'count' },
          { name: '24 hr change', accessor: 'change' },
        ]
      : [
          {
            name: 'Contracts',
            accessor: 'contract',
          },
          { name: 'Transactions', accessor: 'count' },
        ]

  return (
    <div
      id="ContractInvocations"
      className={width > 768 ? '' : 'mobile-contract-invocations'}
    >
      <List
        data={returnBlockListData(contractsInvocations, isLoading)}
        rowId="index"
        withoutPointer
        handleRowClick={(data): null => null}
        isLoading={isLoading}
        columns={columns}
      />
    </div>
  )
}

export default ContractsInvocations
