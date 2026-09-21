import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'

import './Address.scss'
import AddressHeader from './fragments/AddressHeader'
import AddressTransactions from './fragments/transactions/AddressTransactions'
import AddressNFTS from './fragments/nfts/AddressNFTS'
import AddressAssets from './fragments/assets/AddressAssets'
import useDocumentTitle from '../../hooks/useDocumentTitle'

const Address: React.FC = () => {
  const { pathname } = useLocation()
  const segments = pathname.split('/').filter(Boolean)
  useDocumentTitle(['Address', segments[3]])

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
