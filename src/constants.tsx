import React from 'react'

import { ReactComponent as Home } from './assets/icons/home.svg'
import { ReactComponent as Contracts } from './assets/icons/contracts.svg'
import { ReactComponent as Transactions } from './assets/icons/transactions.svg'
import { ReactComponent as Blocks } from './assets/icons/blocks.svg'
import { ReactComponent as Wallets } from './assets/icons/wallets.svg'
import { ReactComponent as Api } from './assets/icons/api.svg'

export const NEO_HASHES = [
  '0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b',
]

export const GAS_HASHES = [
  '0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7',
]

export const GENERATE_BASE_URL = (net = 'test_net'): string =>
  `https://node1.splyse.tech/${net}/v1`

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
  },
  CONTRACTS: {
    url: '/contracts',
    name: 'Contracts',
    renderIcon: (): React.ReactNode => <Contracts />,
  },
  CONTRACT: {
    url: '/contract',
    name: 'Contract',
  },
  TRANSACTIONS: {
    url: '/transactions',
    name: 'Transactions',
    renderIcon: (): React.ReactNode => <Transactions />,
  },
  TRANSACTION: {
    url: '/transaction',
    name: 'Transaction',
  },
  BLOCKS: {
    url: '/blocks',
    name: 'Blocks',
    renderIcon: (): React.ReactNode => <Blocks />,
  },
  BLOCK: {
    url: '/block',
    name: 'Block',
  },
  WALLETS: {
    url: '/addresses',
    name: 'Wallets',
    renderIcon: (): React.ReactNode => <Wallets />,
  },
  WALLET: {
    url: '/address',
    name: 'Wallet',
  },
  API: {
    url: '/api',
    name: 'API',
    renderIcon: (): React.ReactNode => <Api />,
  },
}

export const SIDEBAR_ROUTES = [
  ROUTES.HOME,
  ROUTES.CONTRACTS,
  ROUTES.TRANSACTIONS,
  ROUTES.BLOCKS,
  // ROUTES.WALLETS,
  // ROUTES.API,
]

export const FOOTER_ROUTES = [
  ROUTES.CONTRACTS,
  ROUTES.TRANSACTIONS,
  ROUTES.BLOCKS,
  // ROUTES.WALLETS,
  // ROUTES.API,
]
