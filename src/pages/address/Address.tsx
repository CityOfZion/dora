import React from 'react'
import {
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
  useRouteMatch,
  Redirect,
} from 'react-router-dom'

import './Address.scss'
import AddressHeader from './fragments/AddressHeader'
import AddressTransactions from './fragments/transactions/AddressTransactions'
import AddressNFTS from './fragments/nfts/AddressNFTS'
import AddressAssets from './fragments/assets/AddressAssets'

interface MatchParams {
  hash: string
  chain: string
  network: string
}

type Props = RouteComponentProps<MatchParams>

const Address: React.FC<Props> = (props: Props) => {
  const { path, url } = useRouteMatch()

  return (
    <div id="Address" className="page-container">
      <div className="inner-page-container">
        <AddressHeader />

        <Switch>
          <Route exact path={path}>
            <Redirect to={`${url}/assets`} />
          </Route>
          <Route path={`${path}/assets`} component={AddressAssets} />
          <Route path={`${path}/nfts`} component={AddressNFTS} />
          <Route
            path={`${path}/transactions`}
            component={AddressTransactions}
          />
        </Switch>
      </div>
    </div>
  )
}

export default withRouter(Address)
