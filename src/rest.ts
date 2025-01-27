import { NeoRESTApi } from '@cityofzion/dora-ts/dist/api'

console.log('WTF:', process.env.API_HOST)

export const NeoRest = new NeoRESTApi({
  doraUrl:
    process.env.API_HOST === undefined || process.env.API_HOST === ''
      ? 'https://dora.coz.io'
      : process.env.API_HOST,
  endpoint:
    process.env.API_BASE_PATH === undefined || process.env.API_BASE_PATH === ''
      ? '/api/v2/neo3'
      : process.env.API_BASE_PATH,
})
