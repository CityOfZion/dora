import React, { useEffect } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { State as ContractState } from '../../reducers/contractReducer'
import './Contract.scss'
import { ROUTES } from '../../constants'
import { fetchContract } from '../../actions/contractActions'

interface MatchParams {
  hash: string
}

type Props = RouteComponentProps<MatchParams>

const Contract: React.FC<Props> = (props: Props) => {
  const { hash } = props.match.params
  const dispatch = useDispatch()
  const contractsState = useSelector(
    ({ contract }: { contract: ContractState }) => contract,
  )
  const { contract, isLoading } = contractsState

  useEffect(() => {
    dispatch(fetchContract(hash))
  }, [dispatch, hash])

  return (
    <div id="Contract" className="page-container">
      <div className="inner-page-container">
        <div className="page-title-container">
          {ROUTES.CONTRACTS.renderIcon()}
          <h1>Contract Information</h1>
        </div>

        <div id="contract-details-container">
          <div id="contract-name-info">
            <div id="contract-name">
              {contract && !isLoading && contract.name}
            </div>
            <div>
              <span>CONTRACT:</span> {contract && !isLoading && contract.hash}
            </div>
          </div>
          <div className="details-section">
            <div className="section-label">DETAILS</div>
            <div className="inner-details-container">
              <div className="detail-tile-row">
                <div className="detail-tile">
                  <label>NAME</label>
                  <span>{contract && !isLoading && contract.name}</span>
                </div>
                <div className="detail-tile">
                  <label>TYPE</label>
                  <span>NEP5</span>
                </div>
                <div className="detail-tile">
                  <label>NAME</label>
                  <span>{contract && !isLoading && contract.name}</span>
                </div>
              </div>
              <div className="detail-tile-row">
                <div className="detail-tile">
                  <label>NAME</label>
                  <span>{contract && !isLoading && contract.name}</span>
                </div>
                <div className="detail-tile">
                  <label>NAME</label>
                  <span>{contract && !isLoading && contract.name}</span>
                </div>
                <div className="detail-tile">
                  <label>NAME</label>
                  <span>{contract && !isLoading && contract.name}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="script-section">
            <div className="section-label">SCRIPT</div>
            <div id="contract-script">
              {contract && !isLoading && contract.script}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withRouter(Contract)
