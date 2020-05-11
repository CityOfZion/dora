import React, { ReactElement } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Home from '../../pages/home/Home'
import Navigation from './Navigation'
import Footer from './Footer'
import { ROUTES } from '../../constants'

const Router: React.FC = (): ReactElement => {
  return (
    <>
      <BrowserRouter>
        <Navigation />
        <div id="router-content-wrapper">
          <Switch>
            <Route
              path={ROUTES.HOME.url}
              component={(): ReactElement => <Home />}
            />
          </Switch>
        </div>
      </BrowserRouter>
      <Footer />
    </>
  )
}

export default Router
