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
  SORT_OPTION,
} from '../../reducers/nodeReducer'
import { setNode } from '../../actions/nodeActions'
import List, { ColumnType } from '../../components/list/List'
import { MOCK_NODES } from '../../utils/mockData'
import useFilterState from '../../hooks/useFilterState'
import InformationPanel from '../../components/panel/InformationPanel'
import { ReactComponent as CanadaSVG } from '../../assets/icons/flags/ca.svg'
import { ReactComponent as ChinaSVG } from '../../assets/icons/flags/cn.svg'
import { ReactComponent as HongKongSVG } from '../../assets/icons/flags/hk.svg'
import { ReactComponent as UnitedStatesSVG } from '../../assets/icons/flags/usa.svg'
import { ReactComponent as ApprovedSVG } from '../../assets/icons/approved.svg'
import { ReactComponent as DisapprovedSVG } from '../../assets/icons/disapproved.svg'
import { ReactComponent as OnHoldSVG } from '../../assets/icons/on-hold.svg'
const socket = new Socket('ws://54.90.238.106:8008/socket')

type ParsedNodes = {
  endpoint: React.FC<{}>
  type: React.FC<{}>
  isItUp: React.FC<{}>
  reliability: string | React.FC<{}>
  stateHeight: string | React.FC<{}>
  blockHeight: string | React.FC<{}>
  version: string | React.FC<{}>
  peers: number | React.FC<{}>
  chain: string
}

interface AllNodes {
  disable?: boolean
}

interface Endpoint extends AllNodes {
  url: string
  locationEndPoint: string
}

const STATUS_ICONS = [
  { status: 'ok', Icon: ApprovedSVG, color: '#4cffb3' },
  { status: 'stateheight stalled', Icon: OnHoldSVG, color: '#ffc24c' },
  { status: 'stateheight lagging', Icon: ApprovedSVG, color: '#4cffb3' },
  { status: 'stalled', Icon: DisapprovedSVG, color: '#de4c85' },
]

const Endpoint: React.FC<Endpoint> = ({ url, locationEndPoint, disable }) => {
  const LOCATIONS_FLAGS = [
    { location: 'United States', Flag: UnitedStatesSVG },
    { location: 'USA', Flag: UnitedStatesSVG },
    { location: 'Hong Kong', Flag: HongKongSVG },
    { location: 'Canada', Flag: CanadaSVG },
    { location: 'China', Flag: ChinaSVG },
    { location: 'US', Flag: UnitedStatesSVG },
  ]

  const getFlagByLocation = () => {
    const Flag = LOCATIONS_FLAGS.find(
      ({ location }) => location === locationEndPoint,
    )?.Flag
    return Flag
  }
  const Flag = getFlagByLocation()
  return (
    <div className={disable ? 'endpoint disable' : 'endpoint'}>
      {Flag ? (
        <div className="endpoint-flag-container">
          <Flag />
        </div>
      ) : (
        <></>
      )}
      <div>{url}</div>
    </div>
  )
}

type IsItUp = {
  statusIsItUp: string
}

const IsItUp: React.FC<IsItUp> = ({ statusIsItUp }): JSX.Element => {
  const getIconByStatus = () => {
    const Icon = STATUS_ICONS.find(({ status }) => status === statusIsItUp)
      ?.Icon
    return Icon ?? DisapprovedSVG
  }

  const Icon = getIconByStatus()
  return <div>{<Icon />}</div>
}

interface NegativeComponent extends AllNodes {
  useHashTag?: boolean
}
const NegativeComponent: React.FC<NegativeComponent> = ({
  useHashTag,
  disable,
}) => {
  return useHashTag ? (
    <div className={disable ? 'disable' : ''}># -</div>
  ) : (
    <div className={disable ? 'disable' : ''}>-</div>
  )
}

interface TypeNode extends AllNodes {
  textType: string
}

const TypeNode: React.FC<TypeNode> = ({ disable, textType }) => {
  return <div className={disable ? 'disable' : ''}>{textType}</div>
}

interface Reliability extends AllNodes {
  text: string
}

const Reliability: React.FC<Reliability> = ({ text, disable }) => {
  return <div className={disable ? 'disable' : ''}>{text}</div>
}

interface StateHeight extends AllNodes {
  text: string
}

const StateHeight: React.FC<StateHeight> = ({ text, disable }) => {
  return <div className={disable ? 'disable' : ''}>{text}</div>
}

const mapNodesData = (data: WSDoraData): ParsedNodes => {
  const isPositive = () => {
    if (
      data.status === 'ok' ||
      data.status === 'stateheight stalled' ||
      data.status === 'stateheight lagging'
    ) {
      return true
    } else {
      return false
    }
  }

  return {
    endpoint: (): ReactElement => (
      <Endpoint
        url={data.url}
        locationEndPoint={data.location}
        disable={!isPositive() ? true : false}
      />
    ),
    blockHeight: isPositive()
      ? `#${data.height}`
      : (): ReactElement => (
          <NegativeComponent
            useHashTag={true}
            disable={!isPositive() ? true : false}
          />
        ),
    version: isPositive()
      ? data.version
      : (): ReactElement => (
          <NegativeComponent disable={!isPositive() ? true : false} />
        ),
    type: (): ReactElement => (
      <TypeNode textType={data.type} disable={!isPositive() ? true : false} />
    ),
    peers: isPositive()
      ? data.peers
      : (): ReactElement => (
          <NegativeComponent disable={!isPositive() ? true : false} />
        ),
    reliability: isPositive()
      ? `${data.reliability}%`
      : (): ReactElement => (
          <NegativeComponent disable={!isPositive() ? true : false} />
        ),
    stateHeight: isPositive()
      ? `#${data.stateheight}`
      : (): ReactElement => (
          <NegativeComponent
            useHashTag={true}
            disable={!isPositive() ? true : false}
          />
        ),
    isItUp: (): ReactElement => <IsItUp statusIsItUp={data.status} />,
    chain: data.status || '',
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

const columns: ColumnType[] = [
  { name: 'Endpoint', accessor: 'endpoint', sortOpt: 'endpoint' },
  { name: 'Type', accessor: 'type', sortOpt: 'type' },
  { name: 'Is it up?', accessor: 'isItUp', sortOpt: 'isItUp' },
  { name: 'Reliability', accessor: 'reliability', sortOpt: 'reliability' },
  { name: 'State Height', accessor: 'stateHeight', sortOpt: 'stateHeight' },
  { name: 'Block Height', accessor: 'blockHeight', sortOpt: 'blockHeight' },
  { name: 'Version', accessor: 'version', sortOpt: 'version' },
  { name: 'Peers', accessor: 'peers', sortOpt: 'peers' },
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
      if (data1.height <= data2.height) {
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

  const handleAvgBlockCounter = () => {
    setListAvgBlockTime(prevState => [...prevState, lastBlockCounter])
  }

  useEffect(() => {
    handleAvgBlockCounter()
    setLastBlockCounter(0)
  }, [bestBlock])

  useEffect(() => {
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
    setBestBlock(getBestBlock())
  }, [nodes])

  return (
    <div className="network-status-container">
      <div className="network-status-header">
        <div className="network-status-title">
          <span>Network status</span>
        </div>
      </div>
      <div className="network-status-content">
        <InformationPanel
          title={BEST_BLOCK}
          data={`#${bestBlock
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
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
  const [dataList, setDataList] = useState<Array<ParsedNodes>>([])
  const [sortDataList, setSortDataList] = useState<SORT_OPTION>('isItUp')

  const handleSortDataList = (option: SORT_OPTION) => {
    setSortDataList(option)
  }

  const dispatch = useDispatch()

  useEffect(() => {
    socket.listening<WSDoraData>(data => {
      dispatch(setNode(data))
    })
  }, [dispatch])

  useEffect(() => {
    setDataList(
      returnNodesListData(SerializeNode(nodes, sortDataList), false, network),
    )
  }, [nodes, sortDataList])

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
          data={dataList}
          columns={columns}
          isLoading={!Array(nodes.entries()).length}
          rowId="endpoint"
          leftBorderColorOnRow={(_, chain) => {
            const color = STATUS_ICONS.find(({ status }) => status === chain)
              ?.color
            return color ?? '#de4c85'
          }}
          orderData={true}
          callbalOrderData={handleSortDataList}
        />
      </div>
    </div>
  )
}

export default Monitor
