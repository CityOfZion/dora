import React, { useEffect } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import './Transaction.scss'
import { ROUTES } from '../../constants'
import { fetchTransaction } from '../../actions/transactionActions'

interface MatchParams {
  hash: string
}

type Props = RouteComponentProps<MatchParams>

const Address: React.FC<Props> = (props: Props) => {
  const { hash } = props.match.params
  const dispatch = useDispatch()
  // const addressState = useSelector(
  //   ({ address }: { address: AddressState }) => address,
  // )
  // const { requestedAddress, isLoading } = addressState

  useEffect(() => {
    dispatch(fetchTransaction(hash))
  }, [dispatch, hash])

  return (
    <div id="Address" className="page-container">
      <div className="inner-page-container">
        <div className="page-title-container">
          {ROUTES.WALLETS.renderIcon()}
          <h1>Address Information</h1>
        </div>
      </div>
    </div>
  )
}

export default withRouter(Address)
