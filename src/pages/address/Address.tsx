import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import './Address.scss'
import AddressHeader from './fragments/AddressHeader'
import AddressTransactions from './fragments/transactions/AddressTransactions'
import AddressNFTS from './fragments/nfts/AddressNFTS'
import AddressAssets from './fragments/assets/AddressAssets'

const Address: React.FC = () => {
  return (
    <div id="Address" className="page-container">
      <div className="inner-page-container">
        <AddressHeader />

        <Routes>
          {/* Redirect base path to /assets */}
          <Route index element={<Navigate to="assets" replace />} />

          <Route path="assets" element={<AddressAssets />} />
          <Route path="nfts" element={<AddressNFTS />} />
          <Route path="transactions" element={<AddressTransactions />} />

          {/* Catch-all redirect to /assets if unmatched */}
          <Route path="*" element={<Navigate to="assets" replace />} />
        </Routes>
      </div>
    </div>
  )
}

export default Address
