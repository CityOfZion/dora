import React, { ReactElement } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Home from '../../pages/home/Home'
import Blocks from '../../pages/blocks/Blocks'
import Transactions from '../../pages/transactions/Transactions'
import Contracts from '../../pages/contracts/Contracts'
import Navigation from './Navigation'
import Footer from './Footer'
import Sidebar from './Sidebar'
import { ROUTES } from '../../constants'

const Router: React.FC = (): ReactElement => {
  return (
    <>
      <BrowserRouter>
        <div id="router-container">
          <Sidebar />
          <div className="column-container">
            <Navigation />
            <div className="column-container">
              <Switch>
                <Route
                  path={ROUTES.CONTRACTS.url}
                  component={(): ReactElement => <Contracts />}
                />
                <Route
                  path={ROUTES.TRANSACTIONS.url}
                  component={(): ReactElement => <Transactions />}
                />
                <Route
                  path={ROUTES.BLOCKS.url}
                  component={(): ReactElement => <Blocks />}
                />
                <Route
                  path={ROUTES.HOME.url}
                  component={(): ReactElement => <Home />}
                />
              </Switch>
            </div>
          </div>
        </div>
      </BrowserRouter>
      <Footer />
    </>
  )
}

export default Router
