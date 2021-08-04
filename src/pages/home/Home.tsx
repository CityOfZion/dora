import React from 'react'
import { useSelector } from 'react-redux'

import { State as NetworkState } from '../../reducers/networkReducer'
import Button from '../../components/button/Button'
import logo from '../../assets/icons/logo.png'
import './Home.scss'
import { useHistory } from 'react-router-dom'
import { ROUTES } from '../../constants'
import ContractsInvocations from '../../components/contract-invocation/ContractsInvocations'
import DashboardBlockList from '../../components/block/DashboardBlockList'
import DashboardTransactionsList from '../../components/transaction/DashboardTransactionsList'

const Home: React.FC<{}> = () => {
  const history = useHistory()
  const { network } = useSelector(
    ({ network }: { network: NetworkState }) => network,
  )

  return (
    <div id="Home" className="page-container">
      <div id="inner-home-page-container">
        <div className="full-width-background">
          <div id="inner-full-width-container">
            <div id="neoscan-logo-container">
              <img id="neoscan-logo" alt="neoscan-logo" src={logo} />
              <div id="welcome-text">
                <h1> welcome to dora </h1>{' '}
                <div id="welcome-text-underscore">_</div>
              </div>
              <span>Your home for all Neo related blockchain information</span>
            </div>

            <div className="list-column-container">
              <div>
                <div className="label-wrapper">
                  <label>explore blocks</label>
                  <Button
                    primary
                    onClick={(): void => history.push(ROUTES.BLOCKS.url)}
                  >
                    view all
                  </Button>
                </div>
                <DashboardBlockList network={network} />
              </div>

              <div>
                <div className="label-wrapper">
                  <label>explore transactions</label>
                  <Button
                    primary
                    onClick={(): void => history.push(ROUTES.TRANSACTIONS.url)}
                  >
                    view all
                  </Button>
                </div>
                <DashboardTransactionsList network={network} />
              </div>
            </div>
          </div>
        </div>
        <div id="contracts-invocations-container">
          <div className="invocations-list-wrapper">
            <ContractsInvocations />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
