import React, { ReactElement, useEffect } from 'react'
import { Socket } from '../../config/Socket'
import { useSelector, useDispatch } from 'react-redux'
import './Monitor.scss'
import { ROUTES } from '../../constants'
import Breadcrumbs from '../../components/navigation/Breadcrumbs'
import imgMonitor from '../../assets/icons/monitor.png'
import {
  State as NodeState,
  WSDoraData,
  SerializeState as SerializeNode,
} from '../../reducers/nodeReducer'
import { setNode } from '../../actions/nodeActions'
import List from '../../components/list/List'
import { MOCK_NODES } from '../../utils/mockData'
import useFilterState from '../../hooks/useFilterState'
const socket = new Socket('ws://54.90.238.106:8008/socket')

type ParsedNodes = {
  endpoint: React.FC<{}>
  type: string
  isItUp: React.FC<{}>
  reliability: number
  stateHeight: number
  blockHeight: string
  version: string
  peers: number
}

type Endpoint = {
  url: string
}
const Endpoint: React.FC<Endpoint> = ({ url }) => {
  return (
    <div className="endpoint">
      <div>#</div>
      <div>{url}</div>
    </div>
  )
}

type IsItUp = {
  location: string
}

const IsItUp = (): JSX.Element => {
  return <div></div>
}

const mapNodesData = (data: WSDoraData): ParsedNodes => {
  return {
    endpoint: (): ReactElement => <Endpoint url={data.url} />,
    blockHeight: `#${data.height}`,
    version: data.version,
    type: data.type,
    peers: data.peers,
    reliability: data.reliability,
    stateHeight: data.stateheight,
    isItUp: (): ReactElement => <IsItUp />,
  }
}

const returnNodesListData = (
  data: Array<WSDoraData>,
  returnStub: boolean,
  network: string,
): Array<ParsedNodes> => {
  if (returnStub) {
    return MOCK_NODES.map(n => n)
  } else {
    return data.map(data => mapNodesData(data))
  }
}

const columns = [
  { name: 'Endpoint', accessor: 'endpoint' },
  { name: 'Type', accessor: 'type' },
  { name: 'Is it up?', accessor: 'isItUp' },
  { name: 'Reliability', accessor: 'reliability' },
  { name: 'State Height', accessor: 'stateHeight' },
  { name: 'Block Height', accessor: 'blockHeight' },
  { name: 'Version', accessor: 'version' },
  { name: 'Peers', accessor: 'peers' },
]

const Monitor: React.FC<{}> = () => {
  const { network } = useFilterState()
  const nodes = useSelector(({ node }: { node: NodeState }) => node)

  const dispatch = useDispatch()

  useEffect(() => {
    socket.listening<WSDoraData>(data => {
      dispatch(setNode(data))
    })
  }, [dispatch])

  useEffect(() => {
    console.log('print de nodes => ', SerializeNode(nodes))
  }, [nodes])

  return (
    <div id="Monitor" className="page-container">
      <div className="list-wrapper">
        <Breadcrumbs
          crumbs={[
            {
              url: ROUTES.HOME.url,
              label: 'Home',
            },
            {
              url: '#',
              label: 'Monitor',
              active: true,
            },
          ]}
        />

        <div className="page-title-container">
          <img src={imgMonitor} alt="" />
          <h1>{ROUTES.MONITOR.name}</h1>
        </div>
      </div>
      <div>
        <List
          data={returnNodesListData(SerializeNode(nodes), false, network)}
          columns={columns}
          isLoading={!Array(nodes.entries()).length}
          rowId="endpoint"
        />
      </div>
    </div>
  )
}

export default Monitor
