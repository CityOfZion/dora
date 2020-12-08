import React from 'react'
import { Icon } from '@iconify/react'
import noteIcon from '@iconify/icons-simple-line-icons/note'
import NeoConvertor from 'neo-convertor'

import { store } from './store'
import { ReactComponent as Home } from './assets/icons/home.svg'
import { ReactComponent as Transactions } from './assets/icons/transactions.svg'
import { ReactComponent as Blocks } from './assets/icons/blocks.svg'
import { ReactComponent as Wallets } from './assets/icons/wallets.svg'
import { ReactComponent as Api } from './assets/icons/api.svg'
import { ReactComponent as Magnify } from './assets/icons/magnify.svg'

export const NEO_HASHES = [
  '0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b',
]

export const GAS_HASHES = [
  '0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7',
]

export const GENERATE_BASE_URL = (chain = 'neo2'): string => {
  const net = store.getState().network.network

  if (chain !== 'neo2') {
    return `http://54.227.25.52:8091/api/v1/${chain}/testnet`
  }

  return `https://dora.coz.io/api/v1/${chain}/${net}`
}

export const TRANSFER = '7472616e73666572'

export const TRANSACTION_TYPES: {
  [key: string]: { id: string; label: string }
} = {
  InvocationTransaction: {
    id: 'InvocationTransaction',
    label: 'Invocation',
  },
  MinerTransaction: {
    id: 'MinerTransaction',
    label: 'Miner',
  },
  ClaimTransaction: {
    id: 'ClaimTransaction',
    label: 'Claim',
  },
  ContractTransaction: {
    id: 'ContractTransaction',
    label: 'Contract',
  },
  StateTransaction: {
    id: 'StateTransaction',
    label: 'State',
  },
}

export const SEARCH_TYPES = {
  ADDRESS: 'ADDRESS',
  CONTRACT: 'CONTRACT',
  BLOCK: 'BLOCK',
  TRANSACTION: 'TRANSACTION',
}

export const ROUTES = {
  HOME: {
    url: '/',
    name: 'Home',
    renderIcon: (): React.ReactNode => <Home />,
    target: '_self',
  },
  CONTRACTS: {
    url: '/contracts',
    name: 'Contracts',
    renderIcon: (): React.ReactNode => (
      <Icon icon={noteIcon} style={{ fontSize: 24 }} />
    ),
    target: '_self',
  },
  CONTRACT: {
    url: '/contract',
    name: 'Contract',
    target: '_self',
  },
  TRANSACTIONS: {
    url: '/transactions',
    name: 'Transactions',
    renderIcon: (): React.ReactNode => <Transactions />,
    target: '_self',
  },
  TRANSACTION: {
    url: '/transaction',
    name: 'Transaction',
    target: '_self',
  },
  BLOCKS: {
    url: '/blocks',
    name: 'Blocks',
    renderIcon: (): React.ReactNode => <Blocks />,
    target: '_self',
  },
  BLOCK: {
    url: '/block',
    name: 'Block',
    target: '_self',
  },
  WALLETS: {
    url: '/addresses',
    name: 'Wallets',
    renderIcon: (): React.ReactNode => <Wallets />,
    target: '_self',
  },
  WALLET: {
    url: '/address',
    name: 'Wallet',
    target: '_self',
  },
  API: {
    url: '/documentation/index.html',
    name: 'API',
    renderIcon: (): React.ReactNode => <Api />,
    target: '_blank',
  },
  NOT_FOUND: {
    url: '/not-found',
    name: 'No Results found',
    renderIcon: (): React.ReactNode => <Magnify />,
    target: '_self',
  },
}

export const SIDEBAR_ROUTES = [
  ROUTES.HOME,
  ROUTES.CONTRACTS,
  ROUTES.TRANSACTIONS,
  ROUTES.BLOCKS,
  // ROUTES.WALLETS,
  ROUTES.API,
]

export const FOOTER_ROUTES = [
  ROUTES.CONTRACTS,
  ROUTES.TRANSACTIONS,
  ROUTES.BLOCKS,
  // ROUTES.WALLETS,
  ROUTES.API,
]

export const getAddressFromSriptHash = (hash: string): string => {
  return hash
}

export const hexToAscii = async (str1: string): Promise<string> => {
  const output = new Buffer(str1, 'hex')
  return output.toString()
}

export const asciiToByteArray = (str: string): string => {
  return str
}

export const HEX_STRING_OPTION = {
  value: 'Hexstring',
  label: 'Hexstring',
  convert: (value: string): string => asciiToByteArray(value),
}

export const STRING_OPTION = {
  value: 'String',
  label: 'String',
  convert: async (value: string): Promise<string> => hexToAscii(value),
}

export const INTEGER_OPTION = {
  value: 'Integer',
  label: 'Integer',
}

export const ADDRESS_OPTION = {
  value: 'Address',
  label: 'Address',
  convert: (value: string): Promise<string> =>
    NeoConvertor.Address.scriptHashToAddress(value, true),
}

type TxStateType = {
  value: string
  label: string
  convert?: (val: string) => string | Promise<string>
}

type TxStateTypeMappings = {
  [key: string]: {
    color: string
    options: TxStateType[]
  }
}

export const TX_STATE_TYPE_MAPPINGS: TxStateTypeMappings = {
  Signature: {
    color: '#E9265C',
    options: [HEX_STRING_OPTION, STRING_OPTION],
  },
  Boolean: {
    color: '#D355E7',
    options: [STRING_OPTION],
  },
  Integer: {
    color: '#B167F2',
    options: [INTEGER_OPTION],
  },
  Hash160: {
    color: '#008529',
    options: [HEX_STRING_OPTION, STRING_OPTION],
  },
  Null: {
    color: 'rgba(255, 255, 255, 0.08)',
    options: [STRING_OPTION],
  },
  Hash256: {
    color: '#1DB5FF',
    options: [HEX_STRING_OPTION, STRING_OPTION],
  },
  ByteArray: {
    color: '#0DCDFF',
    options: [HEX_STRING_OPTION, STRING_OPTION, ADDRESS_OPTION],
  },
  PublicKey: {
    color: '#00D69D',
    options: [HEX_STRING_OPTION, STRING_OPTION, ADDRESS_OPTION],
  },
  String: {
    color: '#67DD8B',
    options: [HEX_STRING_OPTION, STRING_OPTION, ADDRESS_OPTION],
  },
  Array: {
    color: '#F28F00',
    options: [HEX_STRING_OPTION, STRING_OPTION, ADDRESS_OPTION],
  },
  InteropInterface: {
    color: '#A50000',
    options: [HEX_STRING_OPTION, STRING_OPTION, ADDRESS_OPTION],
  },
  Void: {
    color: '#528D93',
    options: [STRING_OPTION],
  },
}
