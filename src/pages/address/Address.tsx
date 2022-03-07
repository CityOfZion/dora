import React, { useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import './Address.scss'
import AddressHeader from './fragments/AddressHeader'
import AddressTransactions from './fragments/transactions/AddressTransactions'
import AddressNFTS from './fragments/nfts/AddressNFTS'
import classNames from 'classnames'
import AddressAssets from './fragments/assets/AddressAssets'

interface MatchParams {
  hash: string
  chain: string
  network: string
}

type Props = RouteComponentProps<MatchParams>

const Address: React.FC<Props> = (props: Props) => {
  const [selectedOption, setSelectedOption] = useState('')
  const [rendered, setRendered] = useState({
    assets: false,
    transactions: false,
    nfts: false,
  })

  const isAssets = selectedOption === 'assets'
  const isTransactions = selectedOption === 'transactions'
  const isNfts = selectedOption === 'nfts'

  const onChange = (tabName: string) => {
    setSelectedOption(tabName)
    setRendered({
      ...rendered,
      [tabName]: true,
    })
  }

  return (
    <div id="Address" className="page-container">
      <div className="inner-page-container">
        <AddressHeader {...props} onChange={onChange} />

        {rendered['assets'] && (
          <div
            className={classNames({
              hidden: !isAssets,
            })}
          >
            <AddressAssets {...props} />
          </div>
        )}

        {rendered['nfts'] && (
          <div
            className={classNames({
              hidden: !isNfts,
            })}
          >
            <AddressNFTS {...props} />
          </div>
        )}

        {rendered['transactions'] && (
          <div
            className={classNames({
              hidden: !isTransactions,
            })}
          >
            <AddressTransactions {...props} />
          </div>
        )}
      </div>
    </div>
  )
}

export default withRouter(Address)
