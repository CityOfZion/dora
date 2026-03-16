import { useCallback } from 'react'
import { NeoRest } from '../rest'
import { isEmpty } from 'lodash'
import { u, wallet } from '@cityofzion/neon-js'
import { nativeContracts } from '../constants'

type SearchOptions = {
  protocol: string
  network: string
  type: string
  fetchFn: (text: string) => Promise<any>
  validateFn?: (text: string) => boolean
}

export type SearchResult = Omit<SearchOptions, 'fetchFn' | 'validateFn'> & {
  response: any
  text: string
}

const options: SearchOptions[] = [
  {
    protocol: 'neo3',
    network: 'testnet',
    type: 'block',
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
    type: 'balance',
    fetchFn: (text: string) => NeoRest.balance(text, 'testnet'),
    validateFn: (text: string) => wallet.isAddress(text),
  },
  {
    protocol: 'neo3',
    network: 'testnet',
    type: 'contract',
    fetchFn: (text: string) => NeoRest.contract(text, 'testnet'),
    validateFn: (text: string) => u.isHex(u.remove0xPrefix(text)),
  },
  {
    protocol: 'neo3',
    network: 'testnet',
    type: 'transaction',
    fetchFn: (text: string) => NeoRest.transaction(text, 'testnet'),
    validateFn: (text: string) => u.isHex(u.remove0xPrefix(text)),
  },
  {
    protocol: 'neo3',
    network: 'mainnet',
    type: 'block',
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
    type: 'balance',
    fetchFn: (text: string) => NeoRest.balance(text, 'mainnet'),
    validateFn: (text: string) => wallet.isAddress(text),
  },
  {
    protocol: 'neo3',
    network: 'mainnet',
    type: 'contract',
    fetchFn: (text: string) => NeoRest.contract(text, 'mainnet'),
    validateFn: (text: string) => u.isHex(u.remove0xPrefix(text)),
  },
  {
    protocol: 'neo3',
    network: 'mainnet',
    type: 'transaction',
    fetchFn: (text: string) => NeoRest.transaction(text as any, 'mainnet'),
    validateFn: (text: string) => u.isHex(u.remove0xPrefix(text)),
  },
]

type SearchPrimaryOption = Omit<SearchOptions, 'validateFn'> & {
  validateFn: (text: string) => { valid: boolean; text?: string }
}

const primaryOptions: SearchPrimaryOption[] = [
  {
    protocol: 'neo3',
    network: 'mainnet',
    type: 'contract',
    fetchFn: (text: string) => NeoRest.contract(text, 'mainnet'),
    validateFn: (text: string) => {
      const nativeContractHex = nativeContracts.get(text.toLowerCase())

      return { valid: !!nativeContractHex, text: nativeContractHex }
    },
  },
  {
    protocol: 'neo3',
    network: 'testnet',
    type: 'contract',
    fetchFn: (text: string) => NeoRest.contract(text, 'testnet'),
    validateFn: (text: string) => {
      const nativeContractHex = nativeContracts.get(text.toLowerCase())

      return { valid: !!nativeContractHex, text: nativeContractHex }
    },
  },
]

export const useBlockchainSearch = () => {
  const search = useCallback(async (text: string): Promise<any[]> => {
    const cachedText = text

    const filteredPrimaryOptions = primaryOptions.filter(option => {
      const result = option.validateFn(cachedText)

      if (typeof result.text === 'string') text = result.text

      return result.valid
    })

    let filteredOptions: SearchOptions[] | SearchPrimaryOption[] =
      filteredPrimaryOptions.length > 0 ? filteredPrimaryOptions : []

    if (filteredOptions.length === 0) {
      filteredOptions = options.filter(option => {
        if (option.validateFn) {
          return option.validateFn(text)
        }

        return true
      })
    }

    const searchResults: SearchResult[] = []

    if (filteredOptions.length === 0) {
      return searchResults
    }

    //execute the search across the search scope
    await Promise.allSettled(
      filteredOptions.map(async ({ fetchFn, ...options }) => {
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
  }, [])

  return { search }
}
