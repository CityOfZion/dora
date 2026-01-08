import { useCallback } from 'react'
import { NeoRest } from '../rest'
import { isEmpty } from 'lodash'
interface SearchOptions {
  protocol: string
  network: string
  ctx: any
  method: string
}

const options: SearchOptions[] = [
  { protocol: 'neo3', network: 'testnet', ctx: NeoRest, method: 'block' },
  { protocol: 'neo3', network: 'testnet', ctx: NeoRest, method: 'balance' },
  { protocol: 'neo3', network: 'testnet', ctx: NeoRest, method: 'contract' },
  {
    protocol: 'neo3',
    network: 'testnet',
    ctx: NeoRest,
    method: 'transaction',
  },
  { protocol: 'neo3', network: 'mainnet', ctx: NeoRest, method: 'block' },
  { protocol: 'neo3', network: 'mainnet', ctx: NeoRest, method: 'balance' },
  { protocol: 'neo3', network: 'mainnet', ctx: NeoRest, method: 'contract' },
  {
    protocol: 'neo3',
    network: 'mainnet',
    ctx: NeoRest,
    method: 'transaction',
  },
]

export const useBlockchainSearch = () => {
  const search = useCallback(async (text: string): Promise<any[]> => {
    let searchResults: any[] = []

    //execute the search across the search scope
    await Promise.allSettled(
      options.map(async ({ network, protocol, ctx, method }) => {
        let result = await ctx[method].call(ctx, text, network)

        if (!result || isEmpty(result)) {
          return
        }

        //consider removing the length check since and address may have 0 balance
        if (method === 'balance') {
          result = {
            address: text,
            balances: result,
          }
        }

        result = {
          ...result,
          network: network,
          protocol: protocol,
          type: method,
        }

        searchResults.push(result)
      }),
    )

    return searchResults
  }, [])

  return { search }
}
