import React, { useCallback, useEffect, useState } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { ROUTES } from '../../constants'
import { rpc, sc, u } from '@cityofzion/neon-js'
import NftInformation from '../../components/nft/NftInformation'

const CHAIN = 'neo3'
const NETWORK = 'mainnet'
const CONTRACT_HASH = '0x904deb56fdd9a87b48d89e0cc0ac3415f9207840'
const ENDPOINT = 'https://mainnet4.neo.coz.io:443'

const Lookup: React.FC = () => {
  const location = useLocation()
  const history = useHistory()
  const searchParams = new URLSearchParams(location.search)

  const [tokenId, setTokenId] = useState<string>()

  const isLoading = !tokenId

  const getAssetItemJSON = useCallback(async () => {
    const pubkey = searchParams.get('pubkey')

    if (!pubkey) {
      history.push(ROUTES.HOME.url)
      return
    }

    const sb = new sc.ScriptBuilder()
    sb.emitContractCall({
      scriptHash: CONTRACT_HASH,
      operation: 'getAssetItemJSON',
      args: [sc.ContractParam.byteArray(u.hex2base64(pubkey))],
    })

    const script = sb.build()
    const result = await new rpc.RPCClient(ENDPOINT).invokeScript(
      u.HexString.fromHex(script),
    )

    if (result.stack.length === 0) {
      history.push(ROUTES.HOME.url)
      return
    }

    const id = ((result.stack[0].value as any[])[2] as any).value.value

    setTokenId(id)
  }, [])

  useEffect(() => {
    getAssetItemJSON()
  }, [getAssetItemJSON])

  return (
    <NftInformation
      chain={CHAIN}
      id={tokenId}
      contractHash={CONTRACT_HASH}
      network={NETWORK}
      isLoading={isLoading}
    />
  )
}

export default Lookup
