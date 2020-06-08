export const GENERATE_BASE_URL = (net = 'test_net'): string =>
  `https://node1.splyse.tech/${net}/v1`

export const ROUTES = {
  HOME: {
    url: '/',
    name: 'Home',
  },
  CONTRACTS: {
    url: '/contracts',
    name: 'Contracts',
  },
  TRANSACTIONS: {
    url: '/transactions',
    name: 'Transactions',
  },
  BLOCKS: {
    url: '/blocks',
    name: 'Blocks',
  },
  WALLETS: {
    url: '/wallets',
    name: 'Wallets',
  },
  ASSETS: {
    url: '/assets',
    name: 'Assets',
  },
  API: {
    url: '/api',
    name: 'Api',
  },
}
