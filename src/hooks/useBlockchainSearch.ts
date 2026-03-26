import { useCallback } from 'react'
import { NeoRest } from '../rest'
import { isEmpty } from 'lodash'
import { u, wallet } from '@cityofzion/neon-js'
import { nativeContracts, SEARCH_TYPES } from '../constants'

type SearchOptions = {
  protocol: string
  network: string
  type: string
  fetchFn: (text: string) => Promise<any>
  validateFn: (text: string) => boolean
}

export type SearchResult = Omit<SearchOptions, 'fetchFn' | 'validateFn'> & {
  response: any
  text: string
}

const options: SearchOptions[] = [
  {
    protocol: 'neo3',
    network: 'testnet',
    type: SEARCH_TYPES.BLOCK,
    fetchFn: (text: string) => NeoRest.block(text as any, 'testnet'),
    validateFn: (text: string) => {
      const blockNumber = parseInt(text, 10)
      if (!isNaN(blockNumber)) {
        return true
      }
      return u.isHex(u.remove0xPrefix(text))
    },
  },
  {
    protocol: 'neo3',
    network: 'testnet',
    type: SEARCH_TYPES.BALANCE,
    fetchFn: (text: string) => NeoRest.balance(text, 'testnet'),
    validateFn: (text: string) => wallet.isAddress(text),
  },
  {
    protocol: 'neo3',
    network: 'testnet',
    type: SEARCH_TYPES.CONTRACT,
    fetchFn: (text: string) => NeoRest.contract(text, 'testnet'),
    validateFn: (text: string) => u.isHex(u.remove0xPrefix(text)),
  },
  {
    protocol: 'neo3',
    network: 'testnet',
    type: SEARCH_TYPES.TRANSACTION,
    fetchFn: (text: string) => NeoRest.transaction(text, 'testnet'),
    validateFn: (text: string) => u.isHex(u.remove0xPrefix(text)),
  },
  {
    protocol: 'neo3',
    network: 'mainnet',
    type: SEARCH_TYPES.BLOCK,
    fetchFn: (text: string) => NeoRest.block(text as any, 'mainnet'),
    validateFn: (text: string) => {
      const blockNumber = parseInt(text, 10)
      if (!isNaN(blockNumber)) {
        return true
      }
      return u.isHex(u.remove0xPrefix(text))
    },
  },
  {
    protocol: 'neo3',
    network: 'mainnet',
    type: SEARCH_TYPES.BALANCE,
    fetchFn: (text: string) => NeoRest.balance(text, 'mainnet'),
    validateFn: (text: string) => wallet.isAddress(text),
  },
  {
    protocol: 'neo3',
    network: 'mainnet',
    type: SEARCH_TYPES.CONTRACT,
    fetchFn: (text: string) => NeoRest.contract(text, 'mainnet'),
    validateFn: (text: string) => u.isHex(u.remove0xPrefix(text)),
  },
  {
    protocol: 'neo3',
    network: 'mainnet',
    type: SEARCH_TYPES.TRANSACTION,
    fetchFn: (text: string) => NeoRest.transaction(text as any, 'mainnet'),
    validateFn: (text: string) => u.isHex(u.remove0xPrefix(text)),
  },
]

export const useBlockchainSearch = () => {
  const search = useCallback(
    async (text: string, network: string): Promise<any[]> => {
      // lookup native contract convenience name to contract hash
      const contractHash = nativeContracts.get(text.toLowerCase())

      let searchOptions
      if (!contractHash) {
        searchOptions = options.filter(option => {
          return option.network === network && option.validateFn(text)
        })
      } else {
        searchOptions = options.filter(option => {
          return (
            option.network === network && option.type === SEARCH_TYPES.CONTRACT
          )
        })
        text = contractHash
      }

      if (searchOptions.length === 0) {
        return []
      }

      const searchResults: SearchResult[] = []
      //execute the search across the search scope
      await Promise.allSettled(
        searchOptions.map(async ({ fetchFn, ...options }) => {
          const fetchResponse = await fetchFn(text)

          if (!fetchResponse || isEmpty(fetchResponse)) {
            return
          }

          searchResults.push({
            response: fetchResponse,
            network: options.network,
            protocol: options.protocol,
            type: options.type,
            text,
          })
        }),
      )

      return searchResults
    },
    [],
  )

  return { search }
}
