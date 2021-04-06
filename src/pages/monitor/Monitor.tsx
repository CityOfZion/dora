import React, { ReactElement, useEffect, useState } from 'react'
import { Socket } from '../../config/Socket'
import { useSelector, useDispatch } from 'react-redux'
import './Monitor.scss'
import { ROUTES } from '../../constants'
import Breadcrumbs from '../../components/navigation/Breadcrumbs'
import imgMonitor from '../../assets/icons/monitor.png'
import { ReactComponent as Cube } from '../../assets/icons/cube.svg'
import { ReactComponent as Graphic } from '../../assets/icons/graphic.svg'
import { ReactComponent as Hourglass } from '../../assets/icons/hourglass.svg'
import {
  State as NodeState,
  WSDoraData,
  SerializeState as SerializeNode,
} from '../../reducers/nodeReducer'
import { setNode } from '../../actions/nodeActions'
import List from '../../components/list/List'
import { MOCK_NODES } from '../../utils/mockData'
import useFilterState from '../../hooks/useFilterState'
import InformationPanel from '../../components/panel/InformationPanel'
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

const NetworkStatus: React.FC<{}> = () => {
  const nodes = useSelector(({ node }: { node: NodeState }) => node)
  const BEST_BLOCK = 'Best Block'
  const LAST_BLOCK = 'Last Block'
  const AVG_BLOCK_TIME = 'Avg Block Time'

  const [bestBlock, setBestBlock] = useState<number>(0)
  const [lastBlockCounter, setLastBlockCounter] = useState<number>(0)
  const [listAvgBlockTime, setListAvgBlockTime] = useState<number[]>([])
  const [avgBlockTime, setAvgBlockTime] = useState<string>('')

  const getBestBlock = (): number => {
    const sortedList = SerializeNode(nodes).sort((data1, data2) => {
      if (data1.height - data2.height) {
        return 0
      } else return 1
    })

    if (sortedList.length > 0) {
      return sortedList[0].height
    } else return 0
  }

  const handleLastBlock = (): void => {
    setInterval(() => {
      setLastBlockCounter(prevState => {
        const newCounter = prevState + 1
        return newCounter
      })
    }, 1000)
  }

  useEffect(() => {
    setListAvgBlockTime(prevState => {
      const newList = prevState
      newList.push(lastBlockCounter)
      console.log("print", newList)
      return newList
    })
    setLastBlockCounter(0)
  }, [bestBlock])

  useEffect(() => {
    console.log("AQUI!!!!!!!!")
    console.log(listAvgBlockTime)
    const sumBlockTime = listAvgBlockTime.reduce((avg, time) => {
      avg = avg + time
      return avg
    }, 0)
    setAvgBlockTime((sumBlockTime / listAvgBlockTime.length).toFixed(1))
  }, [listAvgBlockTime])

  useEffect(() => {
    handleLastBlock()
  }, [])

  useEffect(() => {
    //console.log('print de nodes => ', SerializeNode(nodes))
    setBestBlock(getBestBlock())
  }, [nodes])

  return (
    <div className="network-status-container">
      <div className="network-status-header">
        <div className="network-status-title">Network status</div>
      </div>
      <div className="network-status-content">
        <InformationPanel
          title={BEST_BLOCK}
          data={`#${String(bestBlock)}`}
          icon={<Cube />}
        />
        <InformationPanel
          title={LAST_BLOCK}
          data={`${String(lastBlockCounter)} seconds ago`}
          icon={<Hourglass />}
        />
        <InformationPanel
          title={AVG_BLOCK_TIME}
          data={`${avgBlockTime} seconds`}
          icon={<Graphic />}
        />
      </div>
    </div>
  )
}

const Monitor: React.FC<{}> = () => {
  const { network } = useFilterState()
  const nodes = useSelector(({ node }: { node: NodeState }) => node)

  const dispatch = useDispatch()

  useEffect(() => {
    socket.listening<WSDoraData>(data => {
      dispatch(setNode(data))
    })
  }, [dispatch])

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
      <div className=""></div>
      <div>
        <NetworkStatus />
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
