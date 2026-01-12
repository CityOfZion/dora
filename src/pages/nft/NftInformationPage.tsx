import React from 'react'
import { useParams } from 'react-router-dom'
import NftInformation from '../../components/nft/NftInformation'

interface MatchParams extends Record<string, string | undefined> {
  contractHash: string
  chain: string
  network: string
  id: string
}

const NftInformationPage: React.FC = () => {
  const params = useParams<MatchParams>()
  return <NftInformation {...params} />
}

export default NftInformationPage
