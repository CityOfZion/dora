import React, { ReactElement, useEffect } from 'react'
import moment from 'moment'
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
import tokens from '../../assets/nep5/svg'
import useFilterState from '../../hooks/useFilterState'
import Filter from '../../components/filter/Filter'
import PlatformCell from '../../components/platform-cell/PlatformCell'

type Contract = {
  block: number
  time: number
  name?: string
  hash: string
  idx: number
  author?: string
  asset_name: string
  symbol: string
  type: string
  chain?: string
  manifest?: {
    name: string
    extras: {
      name: string
      symbol: string
    }
  }
}

type ParsedContract = {
  time: React.FC<{}>
  block: React.FC<{}>
  name: React.FC<{}>
  symbol: string
  hash: string
  chain: string
  href: string
  platform: React.FC<{}>
}

const mapContractData = (
  contract: Contract,
  network?: string,
): ParsedContract => {
  return {
    platform: (): ReactElement => <PlatformCell chain={contract.chain} />,
    hash: contract.hash,
    name: (): ReactElement => (
      <div className="contract-name-and-icon-row">
        {tokens[contract.symbol] ? (
          <div className="contract-icon-container">
            <img src={tokens[contract.symbol]} alt="token-logo" />
          </div>
        ) : (
          <div className="contract-icon-stub"></div>
        )}
        <div>
          {' '}
          {contract.name ||
            contract.asset_name ||
            contract.manifest?.name ||
            contract.hash}{' '}
        </div>
      </div>
    ),
    symbol: contract.symbol || 'N/A',
    time: (): ReactElement => (
      <div className="contract-time-cell">
        {' '}
        {typeof contract.time === 'number'
          ? moment.unix(contract.time).format('MM-DD-YYYY | hh:mm:ss')
          : moment
              .utc(contract.time)
              .local()
              .format('MM-DD-YYYY | hh:mm:ss')}{' '}
        <ArrowForwardIcon style={{ color: '#D355E7' }} />{' '}
      </div>
    ),
    block: (): ReactElement => (
      <div className="block-index-cell" style={{ color: '#FFFFFF' }}>
        {contract.block.toLocaleString()}{' '}
      </div>
    ),
    chain: '',
    href: `${ROUTES.CONTRACT.url}/${contract.chain}/${network}/${contract.hash}`,
  }
}

const returnContractListData = (
  data: Array<Contract>,
  returnStub: boolean,
  network: string,
): Array<ParsedContract> => {
  if (returnStub) {
    return MOCK_CONTRACT_LIST_DATA.map(c => mapContractData(c))
  } else {
    return data.map(c => mapContractData(c, network))
  }
}

const Contracts: React.FC<{}> = () => {
  const dispatch = useDispatch()
  const contractsState = useSelector(
    ({ contract }: { contract: ContractState }) => contract,
  )

  function loadMore(): void {
    const nextPage = contractsState.page + 1
    dispatch(fetchContracts(nextPage))
  }

  const { selectedChain, handleSetFilterData, network } = useFilterState()

  const selectedData = (): Array<Contract> => {
    switch (selectedChain) {
      case 'neo2':
        return contractsState.neo2List
      case 'neo3':
        return contractsState.neo3List
      default:
        return contractsState.all
    }
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
        <Filter
          handleFilterUpdate={(option): void => {
            handleSetFilterData({
              selectedChain: option.value,
            })
          }}
        />
        <List
          data={returnContractListData(
            selectedData(),
            !selectedData().length,
            network,
          )}
          rowId="hash"
          generateHref={(data): string => `${ROUTES.CONTRACT.url}/${data.id}`}
          isLoading={!contractsState.all.length}
          columns={[
            { name: 'Platform', accessor: 'platform' },
            { name: 'Name', accessor: 'name' },
            { name: 'Symbol', accessor: 'symbol' },

            { name: 'Block', accessor: 'block' },
            { name: 'Created on', accessor: 'time' },
          ]}
          leftBorderColorOnRow="#D355E7"
          countConfig={{
            label: 'Contracts',
          }}
        />
        <div className="load-more-button-container">
          <Button
            disabled={
              contractsState.isLoading || selectedData().length % 15 !== 0
            }
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
