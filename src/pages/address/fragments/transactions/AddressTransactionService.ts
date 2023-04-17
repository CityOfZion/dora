import { NeoRest } from '@cityofzion/dora-ts/dist/api'
import { store } from '../../../../store'
import { AddressTransactionsResponse } from '@cityofzion/dora-ts/dist/interfaces/api/neo'

export const fetchTransaction = async (hash: string, page = 1) => {
  try {
    const network = store.getState().network.network
    return await NeoRest.addressTXFull(hash, page, network)
  } catch (error) {
    console.error(error)
    return { items: [], totalCount: 0 } as AddressTransactionsResponse
  }
}
