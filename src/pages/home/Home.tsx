import React from 'react'

import logo from '../../assets/icons/logo.png'
import './Home.scss'
import '../../constants'
import ContractsInvocations from '../../components/contract-invocation/ContractsInvocations'
import DashboardBlockList from '../../components/block/DashboardBlockList'
import DashboardTransactionsList from '../../components/transaction/DashboardTransactionsList'
import useNetworkGlobalSelector from '../../hooks/useNetworkGlobalSelector'

const Home: React.FC = () => {
  const { network } = useNetworkGlobalSelector()

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

            <div className="list-row-container">
              <div>
                <div className="label-wrapper"></div>
                <DashboardTransactionsList network={network} />
              </div>

              <div>
                <div className="label-wrapper"></div>
                <DashboardBlockList network={network} />
              </div>
            </div>
          </div>
        </div>
        <div id="contracts-invocations-container">
          <div className="invocations-list-wrapper">
            <ContractsInvocations network={network} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
