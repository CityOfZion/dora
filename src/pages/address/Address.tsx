import React from 'react'
import { Routes, Route, Navigate, useMatch } from 'react-router-dom'

import './Address.scss'
import AddressHeader from './fragments/AddressHeader'
import AddressTransactions from './fragments/transactions/AddressTransactions'
import AddressNFTS from './fragments/nfts/AddressNFTS'
import AddressAssets from './fragments/assets/AddressAssets'

const Address: React.FC = () => {
  const match = useMatch('/address/:hash/:chain/:network/*')
  const basePath = match?.pathname || ''

  return (
    <div id="Address" className="page-container">
      <div className="inner-page-container">
        <AddressHeader />

        <Routes>
          {/* Redirect base path to /assets */}
          <Route path={basePath} element={<Navigate to={`${basePath}/assets`} replace />} />

          <Route path={`${basePath}/assets`} element={<AddressAssets />} />
          <Route path={`${basePath}/nfts`} element={<AddressNFTS />} />
          <Route path={`${basePath}/transactions`} element={<AddressTransactions />} />

          {/* Catch-all redirect to /assets if unmatched */}
          <Route path="*" element={<Navigate to={`${basePath}/assets`} replace />} />
        </Routes>
      </div>
    </div>
  )
}

export default Address
