import React, { ReactElement, useEffect } from 'react'
import { BrowserRouter, Switch, useLocation } from 'react-router-dom'

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
import Endpoint from '../../pages/endpoint/Endpoint'

import { MonitorProvider } from '../../contexts/MonitorContext'
import NftInformationPage from '../../pages/nft/NftInformationPage'
import Lookup from '../../pages/lookup/Lookup'
import { SentryRoute } from '../../sentry/SentryRoute'

const ScrollToTop = (): null => {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

const reload = () => {
  window.location.reload()
  return <></>
}

/** If the react-router-dom library is updated, it is essential to find and
 *  update the corresponding version of the routingInstrumentation in Sentry.
 */

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
                <SentryRoute
                  path={ROUTES.HOME.url}
                  component={(): ReactElement => <Home />}
                  exact
                />

                <SentryRoute
                  path={ROUTES.LOOKUP.url}
                  component={(): ReactElement => <Lookup />}
                />

                <SentryRoute
                  path={`${ROUTES.NFT.url}/:chain/:network/:contractHash/:id`}
                  component={(): ReactElement => <NftInformationPage />}
                />

                <SentryRoute
                  path={`${ROUTES.WALLET.url}/:chain/:network/:hash`}
                  component={(): ReactElement => <Address />}
                />

                <SentryRoute
                  path={`${ROUTES.CONTRACT.url}/:chain/:network/:hash`}
                  component={(): ReactElement => <Contract />}
                />

                <SentryRoute
                  exact
                  path={`${ROUTES.TRANSACTION.url}/:chain/:network/:hash`}
                  component={(): ReactElement => <Transaction />}
                />

                <SentryRoute
                  exact
                  path={`${ROUTES.BLOCK.url}/:chain/:network/:hash`}
                  component={(): ReactElement => <Block />}
                />

                <SentryRoute
                  exact
                  path={`${ROUTES.SEARCH.url}/:protocol/:network/:search`}
                  component={(): ReactElement => <SearchResults />}
                />

                <SentryRoute
                  path={ROUTES.CONTRACTS.url}
                  component={(): ReactElement => <Contracts />}
                />
                <SentryRoute
                  path={`${ROUTES.TRANSACTIONS.url}/:chain?/:network?`}
                  component={(): ReactElement => <Transactions />}
                />
                <SentryRoute
                  path={`${ROUTES.BLOCKS.url}/:chain?/:network?`}
                  component={(): ReactElement => <Blocks />}
                />
                <SentryRoute
                  path={ROUTES.MONITOR.url}
                  component={(): ReactElement => (
                    <MonitorProvider>
                      <Monitor />
                    </MonitorProvider>
                  )}
                />
                <SentryRoute
                  exact
                  path={`${ROUTES.ENDPOINT.url}/:endpoint`}
                  component={(): ReactElement => <Endpoint />}
                />
                <SentryRoute
                  path={ROUTES.NOT_FOUND.url}
                  component={(): ReactElement => <NotFound />}
                />
                <SentryRoute path={`${ROUTES.API.url}`} render={reload} />
                <SentryRoute component={(): ReactElement => <NotFound />} />
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
