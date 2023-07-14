import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import NftInformation from '../../components/nft/NftInformation'

interface MatchParams {
  contractHash: string
  chain: string
  network: string
  id: string
}

type Props = RouteComponentProps<MatchParams>

const NftInformationPage: React.FC<Props> = (props: Props) => {
  return <NftInformation {...props.match.params} />
}

export default withRouter(NftInformationPage)
