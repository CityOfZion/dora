import React, { ReactElement, useEffect } from 'react'
import { BrowserRouter, Route, Switch, useLocation } from 'react-router-dom'

import Home from '../../pages/home/Home'
import Blocks from '../../pages/blocks/Blocks'
import Transactions from '../../pages/transactions/Transactions'
import Transaction from '../../pages/transaction/Transaction'
import Contract from '../../pages/contract/Contract'
import Contracts from '../../pages/contracts/Contracts'
import Navigation from './Navigation'
import Footer from './Footer/Footer'
import Sidebar from './Sidebar'
import { ROUTES } from '../../constants'
import Block from '../../pages/block/Block'
import Address from '../../pages/address/Address'
import NotFound from '../../pages/not-found/NotFound'
import SearchResults from '../../pages/search-results/SearchResults'
import Monitor from '../../pages/monitor/Monitor'

import { MonitorProvider } from '../../contexts/MonitorContext'
import NftInformation from '../../pages/nft/NftInformation'

const ScrollToTop = (): null => {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

const reload = () => {
  window.location.reload()
  return <></>
}

const Router: React.FC = (): ReactElement => {
  return (
    <>
      <BrowserRouter>
        <div id="router-container">
          <Sidebar />
          <div className="sidebar-spacer" />
          <div className="column-container">
            <Navigation />

            <div className="column-container router-page-container">
              <ScrollToTop />
              <Switch>
                <Route
                  path={ROUTES.HOME.url}
                  component={(): ReactElement => <Home />}
                  exact
                />

                <Route
                  path={`${ROUTES.NFT.url}/:chain/:network/:contractHash/:id`}
                  component={(): ReactElement => <NftInformation />}
                />

                <Route
                  path={`${ROUTES.WALLET.url}/:chain/:network/:hash`}
                  component={(): ReactElement => <Address />}
                />

                <Route
                  path={`${ROUTES.CONTRACT.url}/:chain/:network/:hash`}
                  component={(): ReactElement => <Contract />}
                />

                <Route
                  exact
                  path={`${ROUTES.TRANSACTION.url}/:chain/:network/:hash`}
                  component={(): ReactElement => <Transaction />}
                />

                <Route
                  exact
                  path={`${ROUTES.BLOCK.url}/:chain/:network/:hash`}
                  component={(): ReactElement => <Block />}
                />

                <Route
                  exact
                  path={`${ROUTES.SEARCH.url}/:protocol/:network/:search`}
                  component={(): ReactElement => <SearchResults />}
                />

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
                  path={ROUTES.MONITOR.url}
                  component={(): ReactElement => (
                    <MonitorProvider>
                      <Monitor />
                    </MonitorProvider>
                  )}
                />

                <Route
                  path={ROUTES.NOT_FOUND.url}
                  component={(): ReactElement => <NotFound />}
                />
                <Route path={`${ROUTES.API.url}`} render={reload} />
                <Route component={(): ReactElement => <NotFound />} />
              </Switch>
            </div>
          </div>
        </div>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default Router
