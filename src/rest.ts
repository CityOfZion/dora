import { NeoRESTApi } from '@cityofzion/dora-ts/dist/api'

export const NeoRest = new NeoRESTApi({
  doraUrl:
    process.env.REACT_APP_API_HOST === undefined ||
    process.env.REACT_APP_API_HOST === ''
      ? 'https://dora.coz.io'
      : process.env.REACT_APP_API_HOST,
  endpoint:
    process.env.REACT_APP_API_BASE_PATH === undefined ||
    process.env.REACT_APP_API_BASE_PATH === ''
      ? '/api/v2/neo3'
      : process.env.REACT_APP_API_BASE_PATH,
})
