import React, { useEffect } from 'react'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import { Icon } from '@iconify/react'
import DateRangeIcon from '@material-ui/icons/DateRange'
import clockIcon from '@iconify/icons-simple-line-icons/clock'
import { useDispatch, useSelector } from 'react-redux'

import { State as ContractState } from '../../reducers/contractReducer'
import './Contract.scss'
import { ROUTES } from '../../constants'
import { fetchContract } from '../../actions/contractActions'
import Breadcrumbs from '../../components/navigation/Breadcrumbs'
import BackButton from '../../components/navigation/BackButton'
import InvocationGraph from '../../components/data-visualization/InvocationGraph'
import useUpdateNetworkState from '../../hooks/useUpdateNetworkState'
import { format24Hours, formatDate } from '../../utils/time'
import Manifest from '../../components/manifest/Manifest'
import bs58check from 'bs58check'
import useWindowWidth from '../../hooks/useWindowWidth'
import { truncateHash } from '../../utils/formatter'

interface MatchParams {
  hash: string
  chain: string
  network: string
}

type Props = RouteComponentProps<MatchParams>

const Contract: React.FC<Props> = (props: Props) => {
  useUpdateNetworkState(props)
  const { hash, chain, network } = props.match.params
  const dispatch = useDispatch()
  const contractsState = useSelector(
    ({ contract }: { contract: ContractState }) => contract,
  )
  const { contract, isLoading, contractStats } = contractsState
  const width = useWindowWidth()

  function getAddressLink(): string {
    if (contract && chain === 'neo3') {
      const d = Buffer.from(hash.slice(2), 'hex')
      d.reverse()
      const inputData = Buffer.alloc(21)
      inputData.writeInt8(0x35, 0)
      inputData.fill(d, 1)
      return bs58check.encode(inputData)
    }
    return ''
  }

  useEffect(() => {
    dispatch(fetchContract(hash))
  }, [dispatch, hash])

  return (
    <div id="Contract" className="page-container">
      <div className="inner-page-container">
        <Breadcrumbs
          crumbs={[
            {
              url: ROUTES.HOME.url,
              label: 'Home',
            },
            {
              url: ROUTES.CONTRACTS.url,
              label: 'Contracts',
            },
            {
              url: '#',
              label:
                (contract && !isLoading && contract.name) || 'Contract info',
              active: true,
            },
          ]}
        />
        <BackButton url={ROUTES.CONTRACTS.url} text="back to contracts" />
        <div className="page-title-container">
          {ROUTES.CONTRACTS.renderIcon()}
          <h1>Contract Information</h1>
        </div>

        <div id="contract-details-container">
          <div id="contract-name-info">
            <div id="contract-name">
              {(contract &&
                !isLoading &&
                contract.manifest &&
                contract?.manifest.name) ||
                'N/A'}
            </div>
            <div className="contract-hash-box">
              <span className="contract-hash-label">CONTRACT:</span>
              <Link
                className="contract-hash"
                to={`${
                  ROUTES.WALLET.url
                }/${chain}/${network}/${getAddressLink()}`}
              >
                {contract &&
                  !isLoading &&
                  truncateHash(contract.hash, width <= 768, undefined, 15)}
              </Link>
            </div>
          </div>

          {contract && contractStats && (
            <div id="contract-invocations-graph-container">
              <div className="section-label" style={{ marginBottom: -20 }}>
                LAST 30 DAYS INVOCATIONS
              </div>
              <InvocationGraph data={contractStats} />
            </div>
          )}

          <div className="details-section">
            <div className="section-label">CONTRACT INFORMATION</div>
            <div className="inner-details-container">
              <div className="detail-tile-row">
                <div className="detail-tile">
                  <label>NAME</label>
                  <span>
                    {(contract &&
                      !isLoading &&
                      contract.manifest &&
                      contract?.manifest.name) ||
                      'N/A'}
                  </span>
                </div>
                <div className="detail-tile">
                  <label>SUPPORTED STANDARDS</label>
                  <span>
                    {contract?.manifest?.supportedstandards.join(', ') || 'N/A'}
                  </span>
                </div>
                <div className="detail-tile">
                  <label>BLOCK</label>

                  <Link
                    to={`${ROUTES.BLOCK.url}/${chain}/${network}/${contract?.block}`}
                  >
                    <span>{contract && !isLoading && contract.block}</span>
                  </Link>
                </div>
              </div>
              <div className="detail-tile-row">
                <div className="detail-tile">
                  <label>IDX</label>
                  <span>
                    {(contract && !isLoading && contract.idx) || 'N/A'}
                  </span>
                </div>
                <div className="detail-tile">
                  <label>RETURN TYPE</label>
                  <span>
                    {(contract && !isLoading && contract.returntype) || 'N/A'}
                  </span>
                </div>
                <div className="detail-tile">
                  <label>TIME</label>

                  <span id="time-details-row">
                    <div>
                      {!isLoading && contract && (
                        <>
                          <DateRangeIcon
                            style={{ color: '#7698A9', fontSize: 20 }}
                          />
                          {formatDate(contract.time)}
                        </>
                      )}
                    </div>
                    <div>
                      {!isLoading && contract && (
                        <>
                          <Icon
                            icon={clockIcon}
                            style={{ color: '#7698A9', fontSize: 18 }}
                          />
                          {format24Hours(contract.time)}
                        </>
                      )}
                    </div>
                  </span>
                </div>
              </div>
            </div>
          </div>
          {chain === 'neo3' && (
            <div className="details-section">
              <div className="section-label">DETAILS</div>
              <div className="inner-details-container">
                <div className="detail-tile-row">
                  <div className="detail-tile">
                    <label>AUTHOR</label>
                    <span>
                      {contract?.manifest?.extra
                        ? contract?.manifest?.extra['Author']
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="detail-tile">
                    <label>EMAIL</label>
                    <span>
                      {contract?.manifest?.extra
                        ? contract?.manifest?.extra['Email']
                        : 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="detail-tile-row">
                  <div className="detail-tile">
                    <label>DESCRIPTION</label>
                    <span>
                      {contract?.manifest?.extra
                        ? contract?.manifest?.extra['Description']
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="detail-tile">
                    <label>COMPILER</label>
                    <span>{contract?.nef?.compiler || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="script-section">
            <div className="section-label">SCRIPT</div>
            <div id="contract-script">{contract?.nef.script || 'NA'}</div>
          </div>

          {contract && contract.manifest && (
            <div className="script-section">
              <div className="section-label">MANIFEST</div>
              <div id="manifest">
                {contract && !isLoading && contract.manifest && (
                  <Manifest manifest={contract.manifest} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default withRouter(Contract)
