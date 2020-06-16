import React from 'react'

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

  return (
    <div id="Home" className="page-container">
      <div id="neoscan-logo-container">
        <img id="neoscan-logo" alt="neoscan-logo" src={logo} />
        <div id="welcome-text">
          <h1> welcome to neoscan </h1>{' '}
          <div id="welcome-text-underscore">_</div>
        </div>
        <span>
          Your home for all NEO related blockchain information THIS IS A TEST
        </span>
      </div>

      <div className="list-row-container">
        <div className="list-wrapper">
          <div className="label-wrapper">
            <label>explore blocks</label>
            <Button
              primary
              onClick={(): void => history.push(ROUTES.BLOCKS.url)}
            >
              view all
            </Button>
          </div>
          <DashboardBlockList />
        </div>
        <div className="list-wrapper">
          <div className="label-wrapper">
            <label>explore transactions</label>
            <Button
              primary
              onClick={(): void => history.push(ROUTES.TRANSACTIONS.url)}
            >
              view all
            </Button>
          </div>
          <DashboardTransactionsList />
        </div>
      </div>

      <div id="contracts-invocations-container">
        <div className="label-wrapper">
          <label>Contract Invocations in the last 24 hourss</label>
        </div>
        <div className="invocations-list-wrapper">
          <ContractsInvocations />
        </div>
      </div>
    </div>
  )
}

export default Home
