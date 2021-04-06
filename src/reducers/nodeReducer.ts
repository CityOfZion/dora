import { SET_NODE, NodeDTO } from '../actions/nodeActions'
export type WSDoraData = {
  locale: string
  location: string
  network: string
  type: string
  height: number
  last_seen: number
  peers: number
  stateheight: number
  status: string
  version: string
  reliability: number
  plugins: {
    name: string
    version: string
    interfaces: string[]
  }[]
  lastblocktime: number
  laststatetime: number
  availability: number
  url: string
}

export type State = Map<string, WSDoraData>

const INITIAL_STATE: State = new Map<string, WSDoraData>()

export const SerializeState = (state: State): WSDoraData[] => {
  const serializedData: WSDoraData[] = []
  Array.from(state.entries()).forEach(([_, data]) => {
    serializedData.push(data)
  })

  return serializedData
}

export default (state: State = INITIAL_STATE, action: NodeDTO): State => {
  switch (action.type) {
    case SET_NODE:
      const newState = new Map<string, WSDoraData>(state)
      newState.set(action.data.url, action.data)
      return newState
    default:
      return state
  }
}
