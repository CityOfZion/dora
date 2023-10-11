import { SET_NODE, NodeDTO } from '../actions/nodeActions'
export type WSDoraData = {
  location: string
  network: string
  height: number
  peers: number
  status: string
  user_agent: string
  availability: number
  url: string
  scheme: string
  host: string
  port: number
}

export type State = {
  bestBlock: number | null
  lastBlock: number | null
  averageBlockTime: number | null
  nodesArray: WSDoraData[]
  nodesMap: Map<string, WSDoraData>
  isLoading: boolean
  totalCount: number
}

export const INITIAL_STATE: State = {
  bestBlock: null,
  lastBlock: null,
  averageBlockTime: null,
  nodesArray: [],
  nodesMap: new Map<string, WSDoraData>(),
  isLoading: true,
  totalCount: 0,
}

export type SORT_OPTION =
  | 'endpoint'
  | 'isItUp'
  | 'availability'
  | 'blockHeight'
  | 'version'
  | 'peers'

export const OrderNodes = (
  field: SORT_OPTION,
  nodes: WSDoraData[],
  desc?: boolean,
): WSDoraData[] => {
  switch (field) {
    case 'endpoint':
      return !desc
        ? nodes.sort((node1, node2) => {
            return node1.url > node2.url ? -1 : node2.url > node1.url ? 1 : 0
          })
        : nodes.sort((node1, node2) => {
            return node1.url < node2.url ? -1 : node2.url < node1.url ? 1 : 0
          })
    case 'blockHeight':
      return !desc
        ? nodes.sort((node1, node2) => {
            return node1.height > node2.height
              ? -1
              : node2.height > node1.height
              ? 1
              : 0
          })
        : nodes.sort((node1, node2) => {
            return node1.height < node2.height
              ? -1
              : node2.height < node1.height
              ? 1
              : 0
          })
    case 'availability':
      return !desc
        ? nodes.sort((node1, node2) => {
            const nodeValidated1 = node1.availability
            const nodeValidated2 = node2.availability
            return nodeValidated1 > nodeValidated2
              ? -1
              : nodeValidated2 > nodeValidated1
              ? 1
              : 0
          })
        : nodes.sort((node1, node2) => {
            const nodeValidated1 = node1.availability
            const nodeValidated2 = node2.availability
            return nodeValidated1 < nodeValidated2
              ? -1
              : nodeValidated2 < nodeValidated1
              ? 1
              : 0
          })
    case 'isItUp':
      const greenCheck = !desc
        ? nodes
            .filter(nodes => {
              return (
                nodes.status === 'ok' || nodes.status === 'stateheight lagging'
              )
            })
            .sort((node1, node2) => {
              return node1.url > node2.url ? -1 : node2.url > node1.url ? 1 : 0
            })
            .sort((node1, node2) => {
              return node1.peers > node2.peers
                ? -1
                : node2.peers > node1.peers
                ? 1
                : 0
            })
        : nodes
            .filter(nodes => {
              return (
                nodes.status === 'ok' || nodes.status === 'stateheight lagging'
              )
            })
            .sort((node1, node2) => {
              return node1.url < node2.url ? -1 : node2.url < node1.url ? 1 : 0
            })
            .sort((node1, node2) => {
              return node1.peers < node2.peers
                ? -1
                : node2.peers < node1.peers
                ? 1
                : 0
            })
      const yellowCheck = !desc
        ? nodes
            .filter(nodes => {
              return nodes.status === 'stateheight stalled'
            })
            .sort((node1, node2) => {
              return node1.url > node2.url ? -1 : node2.url > node1.url ? 1 : 0
            })
            .sort((node1, node2) => {
              return node1.peers > node2.peers
                ? -1
                : node2.peers > node1.peers
                ? 1
                : 0
            })
        : nodes
            .filter(nodes => {
              return nodes.status === 'stateheight stalled'
            })
            .sort((node1, node2) => {
              return node1.url < node2.url ? -1 : node2.url < node1.url ? 1 : 0
            })
            .sort((node1, node2) => {
              return node1.peers < node2.peers
                ? -1
                : node2.peers < node1.peers
                ? 1
                : 0
            })
      const redX = !desc
        ? nodes
            .filter(nodes => {
              return (
                nodes.status !== 'ok' &&
                nodes.status !== 'stateheight lagging' &&
                nodes.status !== 'stateheight stalled'
              )
            })
            .sort((node1, node2) => {
              return node1.url > node2.url ? -1 : node2.url > node1.url ? 1 : 0
            })
            .sort((node1, node2) => {
              return node1.peers > node2.peers
                ? -1
                : node2.peers > node1.peers
                ? 1
                : 0
            })
        : nodes
            .filter(nodes => {
              return (
                nodes.status !== 'ok' &&
                nodes.status !== 'stateheight lagging' &&
                nodes.status !== 'stateheight stalled'
              )
            })
            .sort((node1, node2) => {
              return node1.url < node2.url ? -1 : node2.url < node1.url ? 1 : 0
            })
            .sort((node1, node2) => {
              return node1.peers < node2.peers
                ? -1
                : node2.peers < node1.peers
                ? 1
                : 0
            })
      return !desc
        ? greenCheck.concat(yellowCheck, redX)
        : redX.concat(yellowCheck, greenCheck)

    case 'version':
      return !desc
        ? nodes.sort((node1, node2) => {
            return node1.user_agent > node2.user_agent
              ? -1
              : node2.user_agent > node1.user_agent
              ? 1
              : 0
          })
        : nodes.sort((node1, node2) => {
            return node1.user_agent < node2.user_agent
              ? -1
              : node2.user_agent < node1.user_agent
              ? 1
              : 0
          })
    case 'peers':
      return !desc
        ? nodes.sort((node1, node2) => {
            return node1.peers > node2.peers
              ? -1
              : node2.peers > node1.peers
              ? 1
              : 0
          })
        : nodes.sort((node1, node2) => {
            return node1.peers < node2.peers
              ? -1
              : node2.peers < node1.peers
              ? 1
              : 0
          })
    default:
      return nodes
  }
}

export default (state: State = INITIAL_STATE, action: NodeDTO): State => {
  switch (action.type) {
    case SET_NODE:
      let found = false
      const nodeList = state.nodesArray.map(node => {
        if (node.url === action.data.url) {
          found = true
          return action.data
        }
        return node
      })
      if (!found) {
        nodeList.push(action.data)
      }
      return Object.assign({}, state, {
        nodesArray: nodeList,
        totalCount: nodeList.length,
        isLoading: false,
      })
    default:
      return state
  }
}
