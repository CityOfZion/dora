import React, { ReactElement, useEffect } from 'react'
import { BrowserRouter, Route, useLocation } from 'react-router-dom'

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
import { SentryRoutes } from '../../sentry/SentryRoute'

const ScrollToTop = (): null => {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

const Reload = () => {
  window.location.reload()
  return null
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

              <SentryRoutes>
                <Route path={ROUTES.HOME.url} element={<Home />} />

                <Route path={ROUTES.LOOKUP.url} element={<Lookup />} />

                <Route
                  path={`${ROUTES.NFT.url}/:chain/:network/:contractHash/:id`}
                  element={<NftInformationPage />}
                />

                <Route
                  path={`${ROUTES.WALLET.url}/:chain/:network/:hash/*`}
                  element={<Address />}
                />

                <Route
                  path={`${ROUTES.CONTRACT.url}/:chain/:network/:hash`}
                  element={<Contract />}
                />

                <Route
                  path={`${ROUTES.TRANSACTION.url}/:chain/:network/:hash`}
                  element={<Transaction />}
                />

                <Route
                  path={`${ROUTES.BLOCK.url}/:chain/:network/:hash`}
                  element={<Block />}
                />

                <Route
                  path={`${ROUTES.SEARCH.url}/:protocol/:network`}
                  element={<SearchResults />}
                />

                <Route path={ROUTES.CONTRACTS.url} element={<Contracts />} />
                <Route
                  path={`${ROUTES.TRANSACTIONS.url}/:chain?/:network?`}
                  element={<Transactions />}
                />
                <Route
                  path={`${ROUTES.BLOCKS.url}/:chain?/:network?`}
                  element={<Blocks />}
                />
                <Route
                  path={ROUTES.MONITOR.url}
                  element={
                    <MonitorProvider>
                      <Monitor />
                    </MonitorProvider>
                  }
                />
                <Route
                  path={`${ROUTES.ENDPOINT.url}/:endpoint`}
                  element={<Endpoint />}
                />
                <Route path={ROUTES.NOT_FOUND.url} element={<NotFound />} />
                <Route path={ROUTES.API.url} element={<Reload />} />
                <Route element={<NotFound />} />
              </SentryRoutes>
            </div>
          </div>
        </div>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default Router
