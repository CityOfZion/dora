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
import useWindowWidth from '../../hooks/useWindowWidth'
import Filter, { Platform } from '../../components/filter/Filter'
import PlatformCell from '../../components/platform-cell/PlatformCell'
import { useHistory } from 'react-router-dom'
import useFilterStateWithHistory from '../../hooks/useFilterStateWithHistory'

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
  protocol?: string
  network?: string
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

const mapContractData = (contract: Contract): ParsedContract => {
  return {
    platform: (): ReactElement => (
      <PlatformCell protocol={contract.protocol} network={contract.network} />
    ),
    chain: contract.protocol || '',
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
        {moment
          .unix(Number(contract.time))
          .format('MM-DD-YYYY | hh:mm:ss')}{' '}
        <ArrowForwardIcon style={{ color: '#D355E7' }} />{' '}
      </div>
    ),
    block: (): ReactElement => (
      <div className="block-index-cell" style={{ color: '#FFFFFF' }}>
        {contract.block.toLocaleString()}{' '}
      </div>
    ),
    href: `${ROUTES.CONTRACT.url}/${contract.protocol}/${contract.network}/${contract.hash}`,
  }
}

const returnContractListData = (
  data: Array<Contract>,
  returnStub: boolean,
): Array<ParsedContract> => {
  if (returnStub) {
    return MOCK_CONTRACT_LIST_DATA.map(c => mapContractData(c))
  } else {
    return data.map(c => mapContractData(c))
  }
}

const Contracts: React.FC<{}> = () => {
  const dispatch = useDispatch()
  const contractsState = useSelector(
    ({ contract }: { contract: ContractState }) => contract,
  )
  const width = useWindowWidth()
  const history = useHistory()

  const columns =
    width > 768
      ? [
          { name: 'Platform', accessor: 'platform' },
          { name: 'Name', accessor: 'name' },
          { name: 'Symbol', accessor: 'symbol' },

          { name: 'Block', accessor: 'block' },
          { name: 'Created on', accessor: 'time' },
        ]
      : [
          { name: 'Platform', accessor: 'platform' },
          { name: 'Name', accessor: 'name' },
        ]

  function loadMore(): void {
    const nextPage = contractsState.page + 1
    dispatch(fetchContracts(nextPage))
  }

  const { protocol, handleSetFilterData, network } = useFilterStateWithHistory(
    history,
    'neo3',
    'mainnet',
  )
  const selectedData = (): Array<Contract> => {
    if (protocol === 'all' && network === 'all') {
      return contractsState.all as Contract[]
    } else if (protocol === 'all' && network !== 'all') {
      return contractsState.all.filter(d => d.network === network) as Contract[]
    } else if (protocol !== 'all' && network === 'all') {
      return contractsState.all.filter(
        d => d.protocol === protocol,
      ) as Contract[]
    } else {
      return contractsState.all.filter(
        d => d.protocol === protocol && d.network === network,
      ) as Contract[]
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
          selectedOption={{
            label: '',
            value: {
              protocol,
              network,
            },
          }}
          handleFilterUpdate={(option): void => {
            handleSetFilterData({
              protocol: (option.value as Platform).protocol,
              network: (option.value as Platform).network,
            })
          }}
        />
        <List
          data={returnContractListData(selectedData(), !selectedData().length)}
          rowId="hash"
          generateHref={(data): string => `${ROUTES.CONTRACT.url}/${data.id}`}
          isLoading={!contractsState.all.length}
          columns={columns}
          leftBorderColorOnRow={(
            id: string | number | void | React.FC<{}>,
            chain: string | number | void | React.FC<{}>,
          ): string => {
            if (typeof chain === 'string') {
              interface TxColorMap {
                [key: string]: string
              }

              const txColorMap: TxColorMap = {
                neo2: '#b0eb3c',
                neo3: '#88ffad',
              }

              if (chain && txColorMap[chain || 'neo2']) {
                return txColorMap[chain || 'neo2']
              }
            }

            return ''
          }}
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
