import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import moment from 'moment'
import React, { ReactElement, useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { fetchContracts } from '../../actions/contractActions'
import List from '../../components/list/List'
import Breadcrumbs from '../../components/navigation/Breadcrumbs'
import ListPagination from '../../components/pagination/ListPagination'
import PlatformCell from '../../components/platform-cell/PlatformCell'
import { TokenIcon } from '../../components/token-icon/TokenIcon'
import { ROUTES } from '../../constants'
import useNetworkGlobalSelector from '../../hooks/useNetworkGlobalSelector'
import useWindowWidth from '../../hooks/useWindowWidth'
import {
  Contract,
  State as ContractState,
} from '../../reducers/contractReducer'
import { AppThunkDispatch } from '../../store'
import { MOCK_CONTRACT_LIST_DATA } from '../../utils/mockData'
import './Contracts.scss'
import { usePagination } from '../../hooks/usePagination'
import useDocumentTitle from '../../hooks/useDocumentTitle'

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

type MapContractDataParams = {
  contract: Contract
}

type ReturnContractListDataParams = {
  data: Array<Contract>
  returnStub: boolean
}

const mapContractData = ({
  contract,
}: MapContractDataParams): ParsedContract => {
  return {
    platform: (): ReactElement => (
      <PlatformCell protocol={contract.protocol} network={contract.network} />
    ),
    chain: contract.protocol || '',
    hash: contract.hash,
    name: (): ReactElement => (
      <div className="contract-name-and-icon-row">
        {contract.protocol &&
          contract.protocol.length > 0 &&
          contract.hash.length > 0 &&
          contract.symbol.length > 0 && (
            <TokenIcon
              symbol={contract.symbol}
              blockchain={contract.protocol}
              hash={contract.hash}
              className="contract-icon"
            />
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

const returnContractListData = ({
  data,
  returnStub,
}: ReturnContractListDataParams): Array<ParsedContract> => {
  if (returnStub) {
    return MOCK_CONTRACT_LIST_DATA.map(contract =>
      mapContractData({ contract }),
    )
  } else {
    return data.map(contract => mapContractData({ contract }))
  }
}

const Contracts: React.FC = () => {
  useDocumentTitle(['Contracts'])

  const dispatch = useDispatch<AppThunkDispatch>()
  const contractsState = useSelector(
    ({ contract }: { contract: ContractState }) => contract,
  )
  const { network } = useNetworkGlobalSelector()
  const width = useWindowWidth()
  const { perPage, page, model } = usePagination({
    loadPage,
    totalCount: contractsState.totalCount,
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

  function loadPage(nextPage: number): void {
    dispatch(fetchContracts(network, nextPage))
  }

  useEffect(() => {
    dispatch(fetchContracts(network, page))
  }, [network, page])

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
          data={returnContractListData({
            data: contractsState.all,
            returnStub: !contractsState.all.length,
          })}
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
