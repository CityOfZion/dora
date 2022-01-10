import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import AddressHeader from './AddressHeader'

interface MatchParams {
  hash: string
  chain: string
  network: string
}

type Props = RouteComponentProps<MatchParams>

const AddressNft: React.FC<Props> = (props: Props) => {
  return <AddressHeader {...props} />
}

export default withRouter(AddressNft)
