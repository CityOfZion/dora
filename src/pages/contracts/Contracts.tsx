import React, { ReactElement, useEffect } from 'react'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'

import { MOCK_CONTRACT_LIST_DATA } from '../../utils/mockData'
import List from '../../components/list/List'
import { useDispatch, useSelector } from 'react-redux'
import { State as ContractState } from '../../reducers/contractReducer'
import './Contracts.scss'
import Button from '../../components/button/Button'
import { ROUTES } from '../../constants'
import { fetchContracts, clearList } from '../../actions/contractActions'
import Breadcrumbs from '../../components/navigation/Breadcrumbs'

type Contract = {
  block: number
  time: number
  idx: number
  hash: string
}

type ParsedContract = {
  time: React.FC<{}>
  block: React.FC<{}>
  hash: string
}

const mapContractData = (contract: Contract): ParsedContract => {
  return {
    hash: contract.hash,
    time: (): ReactElement => (
      <div className="contract-time-cell">
        {' '}
        {moment.unix(contract.time).format('MM-DD-YYYY | hh:mm:ss')}{' '}
        <ArrowForwardIcon style={{ color: '#D355E7' }} />{' '}
      </div>
    ),
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
        <Breadcrumbs
          crumbs={[
            {
              url: ROUTES.HOME.url,
              label: 'Home',
            },
            {
              url: '#',
              label: 'Contracts',
              active: true,
            },
          ]}
        />
        <div className="page-title-container">
          {ROUTES.CONTRACTS.renderIcon()}
          <h1>{ROUTES.CONTRACTS.name}</h1>
        </div>
        <List
          data={returnBlockListData(
            contractsState.list,
            !contractsState.list.length,
          )}
          rowId="index"
          handleRowClick={(data): void =>
            history.push(`${ROUTES.CONTRACT.url}/${data.hash}`)
          }
          isLoading={!contractsState.list.length}
          columns={[
            { name: 'Hash', accessor: 'hash' },
            { name: 'Block', accessor: 'block' },
            { name: 'Created on', accessor: 'time' },
          ]}
          leftBorderColorOnRow="#D355E7"
          countConfig={{
            label: 'Contracts',
            total:
              contractsState.list &&
              contractsState.list[0] &&
              contractsState.totalCount,
          }}
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
