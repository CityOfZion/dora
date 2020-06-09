import React from 'react'

import { ReactComponent as Home } from './assets/icons/home.svg'
import { ReactComponent as Contracts } from './assets/icons/contracts.svg'
import { ReactComponent as Transactions } from './assets/icons/transactions.svg'
import { ReactComponent as Blocks } from './assets/icons/blocks.svg'
import { ReactComponent as Wallets } from './assets/icons/wallets.svg'
import { ReactComponent as Api } from './assets/icons/api.svg'

export const GENERATE_BASE_URL = (net = 'test_net'): string =>
  `https://node1.splyse.tech/${net}/v1`

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
