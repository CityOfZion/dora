import { NeoRESTApi } from '@cityofzion/dora-ts/dist/api'

export const NeoRest = new NeoRESTApi({
  doraUrl: import.meta.env.VITE_API_HOST || 'https://api.coz.io',
  endpoint: import.meta.env.VITE_API_BASE_PATH || '/api/v2/neo3',
})
