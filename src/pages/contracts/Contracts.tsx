import React, { ReactElement, useEffect, useState } from 'react'
import moment from 'moment'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

import List from '../../components/list/List'
import { useDispatch, useSelector } from 'react-redux'
import {
  Contract,
  State as ContractState,
} from '../../reducers/contractReducer'
import './Contracts.scss'
import { ROUTES } from '../../constants'
import { fetchContracts } from '../../actions/contractActions'
import Breadcrumbs from '../../components/navigation/Breadcrumbs'
import tokens from '../../assets/nep5/svg'
import useWindowWidth from '../../hooks/useWindowWidth'
import PlatformCell from '../../components/platform-cell/PlatformCell'
import { getLastPage, usePaginationModel } from '@workday/canvas-kit-react'
import ListPagination from '../../components/pagination/ListPagination'
import { AppThunkDispatch } from '../../store'
import useNetworkGlobalSelector from '../../hooks/useNetworkGlobalSelector'

type ParsedContract = {
  time: React.FC
  block: React.FC
  name: React.FC
  symbol: string
  hash: string
  chain: string
  href: string
  platform: React.FC
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
        <div className="contract-name-label">
          {contract.name ||
            contract.asset_name ||
            contract.manifest?.name ||
            contract.hash}
        </div>
      </div>
    ),
    symbol: contract.symbol || 'N/A',
    time: (): ReactElement => (
      <div className="contract-time-cell">
        {' '}
        {moment
          .unix(Number(contract.time))
          .format('MM-DD-YYYY | HH:mm:ss')}{' '}
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
    return []
  } else {
    return data.map(c => mapContractData(c))
  }
}

const Contracts: React.FC = () => {
  const dispatch = useDispatch<AppThunkDispatch>()
  const contractsState = useSelector(
    ({ contract }: { contract: ContractState }) => contract,
  )
  const { network } = useNetworkGlobalSelector()
  const width = useWindowWidth()
  const [perPage, setPerPage] = useState<number>(0)
  const model = usePaginationModel({
    lastPage: getLastPage(perPage, contractsState.totalCount),
    onPageChange: pageNumber => loadPage(pageNumber),
  })

  const columns =
    width > 768
      ? [
          { name: 'Network', accessor: 'platform' },
          { name: 'Name', accessor: 'name' },
          { name: 'Symbol', accessor: 'symbol' },

          { name: 'Block', accessor: 'block' },
          { name: 'Created on', accessor: 'time' },
        ]
      : [
          { name: 'Network', accessor: 'platform' },
          { name: 'Name', accessor: 'name' },
        ]

  function loadPage(page: number): void {
    dispatch(fetchContracts(network, page))
  }

  useEffect(() => {
    setPerPage(15)
    dispatch(fetchContracts(network))
  }, [network])

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
          data={returnContractListData(
            contractsState.all,
            !contractsState.all.length,
          )}
          rowId="hash"
          generateHref={(data): string => `${ROUTES.CONTRACT.url}/${data.id}`}
          isLoading={contractsState.isLoading}
          columns={columns}
          leftBorderColorOnRow={(
            id: string | number | void | React.FC,
            chain: string | number | void | React.FC,
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
        <div className="contract-list-pagination">
          <ListPagination
            perPage={perPage}
            totalCount={contractsState.totalCount}
            model={model}
            isLoading={contractsState.isLoading}
          />
        </div>
      </div>
    </div>
  )
}

export default Contracts
