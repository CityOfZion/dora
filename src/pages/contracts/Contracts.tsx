import React, { ReactElement, useEffect } from 'react'
import moment from 'moment'
import { useHistory } from 'react-router-dom'

import { MOCK_CONTRACT_LIST_DATA } from '../../utils/mockData'
import List from '../../components/list/List'
import { useDispatch, useSelector } from 'react-redux'
import { State as ContractState } from '../../reducers/contractReducer'
import './Contracts.scss'
import Button from '../../components/button/Button'
import { ROUTES } from '../../constants'
import { fetchContracts, clearList } from '../../actions/contractActions'

type Contract = {
  block: number
  time: number
  idx: number
  hash: string
}

type ParsedContract = {
  time: string
  block: React.FC<{}>
  hash: string
}

const mapContractData = (contract: Contract): ParsedContract => {
  return {
    hash: contract.hash,
    time: moment.unix(contract.time).format('MM-DD-YYY | HH:MM:SS'),
    block: (): ReactElement => (
      <div className="block-index-cell">{contract.block.toLocaleString()} </div>
    ),
  }
}

const returnBlockListData = (
  data: Array<Contract>,
  returnStub: boolean,
): Array<ParsedContract> => {
  if (returnStub) {
    return MOCK_CONTRACT_LIST_DATA.map(mapContractData)
  } else {
    return data.map(mapContractData)
  }
}

const Contracts: React.FC<{}> = () => {
  const dispatch = useDispatch()
  const contractsState = useSelector(
    ({ contract }: { contract: ContractState }) => contract,
  )
  const history = useHistory()

  function loadMore(): void {
    const nextPage = contractsState.page + 1
    dispatch(fetchContracts(nextPage))
  }

  useEffect(() => {
    dispatch(fetchContracts())
    return (): void => {
      dispatch(clearList())
    }
  }, [dispatch])

  return (
    <div id="Contracts" className="page-container">
      <div className="list-wrapper">
        <div className="page-title-container">
          {ROUTES.CONTRACTS.renderIcon()}
          <h1>{ROUTES.CONTRACTS.name}</h1>
        </div>
        <List
          data={returnBlockListData(
            contractsState.list,
            contractsState.isLoading && !contractsState.list.length,
          )}
          rowId="index"
          handleRowClick={(data): void =>
            history.push(`${ROUTES.CONTRACT.url}/${data.hash}`)
          }
          isLoading={contractsState.isLoading && !contractsState.list.length}
          columns={[
            { name: 'Hash', accessor: 'hash' },
            { name: 'Block', accessor: 'block' },
            { name: 'Created on', accessor: 'time' },
          ]}
        />
        <div className="load-more-button-container">
          <Button
            disabled={contractsState.isLoading}
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

export default Contracts
