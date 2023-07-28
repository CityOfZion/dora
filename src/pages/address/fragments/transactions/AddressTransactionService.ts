import { NeoRESTApi } from '@cityofzion/dora-ts/dist/api'
import { store } from '../../../../store'
import { AddressTransactionsResponse } from '@cityofzion/dora-ts/dist/interfaces/api/neo'

const NeoRest = new NeoRESTApi({
  doraUrl: 'https://dora.coz.io',
  endpoint: '/api/v2/neo3',
})

export const fetchTransaction = async (hash: string, page = 1) => {
  try {
    const network = store.getState().network.network
    return await NeoRest.addressTXFull(hash, page, network)
  } catch (error) {
    console.error(error)
    return { items: [], totalCount: 0 } as AddressTransactionsResponse
  }
}
