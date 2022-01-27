import React, { ReactElement, useEffect, useState, useContext } from 'react'
import ReactCountryFlag from 'react-country-flag'
import { useSelector, useDispatch } from 'react-redux'
import Snackbar from '@material-ui/core/Snackbar'
import { Socket } from '../../config/Socket'
import './Monitor.scss'
import { ROUTES } from '../../constants'
import Breadcrumbs from '../../components/navigation/Breadcrumbs'
import { ReactComponent as Cube } from '../../assets/icons/cube.svg'
import { ReactComponent as Graphic } from '../../assets/icons/graphic.svg'
import { ReactComponent as Hourglass } from '../../assets/icons/hourglass.svg'
import {
  State as NodeState,
  WSDoraData,
  SORT_OPTION,
  OrderNodes,
} from '../../reducers/nodeReducer'
import { setNode } from '../../actions/nodeActions'
import List, { ColumnType } from '../../components/list/List'
import { MOCK_NODES } from '../../utils/mockData'
import InformationPanel from '../../components/panel/InformationPanel'
import { ReactComponent as ApprovedSVG } from '../../assets/icons/approved.svg'
import { ReactComponent as DisapprovedSVG } from '../../assets/icons/disapproved.svg'
import { ReactComponent as OnHoldSVG } from '../../assets/icons/on-hold.svg'
import { MonitorContext } from '../../contexts/MonitorContext'
import { ReactComponent as CopyIcon } from '../../assets/icons/content_copy_white_48dp.svg'
import useWindowWidth from '../../hooks/useWindowWidth'
import Filter, { Platform } from '../../components/filter/Filter'
import { useHistory } from 'react-router-dom'
import useFilterStateWithHistory from '../../hooks/useFilterStateWithHistory'

const socket = new Socket('wss://dora.coz.io/ws/v1/unified/network_status')

type ParsedNodes = {
  endpoint: React.FC<{}>
  type: React.FC<{}>
  isItUp: React.FC<{}>
  availability: string | React.FC<{}>
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
  locale: string
}

const STATUS_ICONS = [
  { status: 'ok', Icon: ApprovedSVG, color: '#4cffb3' },
  { status: 'stateheight stalled', Icon: OnHoldSVG, color: '#ffc24c' },
  { status: 'stateheight lagging', Icon: ApprovedSVG, color: '#4cffb3' },
  { status: 'stalled', Icon: DisapprovedSVG, color: '#de4c85' },
]

const Endpoint: React.FC<Endpoint> = ({ url, locale, disable }) => {
  const { setMessage, setShowMessage } = useContext(MonitorContext)
  const handleClickEndpoint = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ): void => {
    e.preventDefault()
    navigator.clipboard.writeText(url)
    setMessage('Copied to Clipboard!')
    setShowMessage(true)
  }

  return (
    <div className={disable ? 'endpoint disable' : 'endpoint'}>
      <div className="endpoint-flag-container">
        <ReactCountryFlag
          svg
          style={{
            fontSize: '1.5em',
            lineHeight: '1.5em',
          }}
          countryCode={locale}
        />
      </div>
      <div className="endpoint-url">{url}</div>
      <div className="cursor-pointer" onClick={handleClickEndpoint}>
        <CopyIcon className="endpoint-copy-icon" />
      </div>
    </div>
  )
}

type IsItUp = {
  statusIsItUp: string
}

const IsItUp: React.FC<IsItUp> = ({ statusIsItUp }): JSX.Element => {
  const getIconByStatus = (): React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined
    }
  > => {
    const Icon = STATUS_ICONS.find(
      ({ status }) => status === statusIsItUp,
    )?.Icon
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

const mapNodesData = (data: WSDoraData): ParsedNodes => {
  const isPositive = (): boolean =>
    data.status === 'ok' ||
    data.status === 'stateheight stalled' ||
    data.status === 'stateheight lagging'

  return {
    endpoint: (): ReactElement => (
      <Endpoint
        url={data.url}
        locale={data.locale}
        disable={!isPositive()}
        key={data.url}
      />
    ),
    blockHeight: isPositive()
      ? `#${data.height}`
      : (): ReactElement => (
          <NegativeComponent useHashTag={true} disable={!isPositive()} />
        ),
    version: isPositive()
      ? data.version
      : (): ReactElement => <NegativeComponent disable={!isPositive()} />,
    type: (): ReactElement => (
      <TypeNode textType={data.type} disable={!isPositive()} />
    ),
    peers: isPositive()
      ? data.peers
      : (): ReactElement => <NegativeComponent disable={!isPositive()} />,
    availability: isPositive()
      ? `${data.availability}%`
      : (): ReactElement => <NegativeComponent disable={!isPositive()} />,
    stateHeight: isPositive()
      ? `#${data.stateheight}`
      : (): ReactElement => (
          <NegativeComponent useHashTag={true} disable={!isPositive()} />
        ),
    isItUp: (): ReactElement => <IsItUp statusIsItUp={data.status} />,
    chain: data.status || '',
  }
}

const returnNodesListData = (
  data: Array<WSDoraData>,
  returnStub: boolean,
): Array<ParsedNodes> => {
  if (returnStub) {
    return MOCK_NODES.map(n => n)
  } else {
    return data.map(data => mapNodesData(data))
  }
}

const columns: ColumnType[] = [
  {
    name: 'Endpoint',
    accessor: 'endpoint',
    sortOpt: 'endpoint',
    style: { minWidth: '250px' },
  },
  { name: 'Type', accessor: 'type', sortOpt: 'type' },
  { name: 'Is it up?', accessor: 'isItUp', sortOpt: 'isItUp' },
  { name: 'Availability', accessor: 'availability', sortOpt: 'availability' },
  { name: 'State Height', accessor: 'stateHeight', sortOpt: 'stateHeight' },
  { name: 'Block Height', accessor: 'blockHeight', sortOpt: 'blockHeight' },
  { name: 'Version', accessor: 'version', sortOpt: 'version' },
  { name: 'Peers', accessor: 'peers', sortOpt: 'peers' },
]

const tabletColumns: ColumnType[] = [
  {
    name: 'Endpoint',
    accessor: 'endpoint',
    sortOpt: 'endpoint',
    style: { minWidth: '200px' },
  },
  { name: 'Is it up?', accessor: 'isItUp', sortOpt: 'isItUp' },

  { name: 'Block Height', accessor: 'blockHeight', sortOpt: 'blockHeight' },
  { name: 'Version', accessor: 'version', sortOpt: 'version' },
  { name: 'Peers', accessor: 'peers', sortOpt: 'peers' },
]

const mobileColumns: ColumnType[] = [
  {
    name: 'Endpoint',
    accessor: 'endpoint',
    sortOpt: 'endpoint',
    style: { minWidth: '100px' },
  },
  { name: 'Is it up?', accessor: 'isItUp', sortOpt: 'isItUp' },
  { name: 'Availability', accessor: 'availability', sortOpt: 'availability' },
]

interface NetworkStatus {
  data: WSDoraData[]
}
const NetworkStatus: React.FC<NetworkStatus> = ({ data }) => {
  const BEST_BLOCK = 'Best Block'
  const LAST_BLOCK = 'Last Block'
  const AVG_BLOCK_TIME = 'Avg Block Time'

  const getBestBlock = (): number => {
    const sortedList = data.sort((data1, data2) => {
      if (data1.height <= data2.height) {
        return 0
      } else return 1
    })

    if (sortedList.length > 0) {
      return sortedList[0].height
    } else return 0
  }

  const [bestBlock, setBestBlock] = useState<number>(getBestBlock())
  const [lastBlockCounter, setLastBlockCounter] = useState<number>(0)
  const [listAvgBlockTime, setListAvgBlockTime] = useState<number[]>([])
  const [avgBlockTime, setAvgBlockTime] = useState<string>('')

  const handleLastBlock = (): void => {
    setInterval(() => {
      setLastBlockCounter(prevState => {
        return prevState + 1
      })
    }, 1000)
  }

  const handleAvgBlockCounter = (): void => {
    //workaround for integrator wind-up
    if (
      listAvgBlockTime.length > 0 ||
      (listAvgBlockTime.length === 0 && lastBlockCounter > 2)
    ) {
      setListAvgBlockTime(prevState => [...prevState, lastBlockCounter])
    }
  }

  useEffect(() => {
    handleAvgBlockCounter()
    setLastBlockCounter(0) //eslint-disable-next-line
  }, [bestBlock])

  useEffect(() => {
    const sumBlockTime = listAvgBlockTime.reduce((avg, time) => {
      avg = avg + time
      return avg
    }, 0)
    if (listAvgBlockTime.length !== 0) {
      setAvgBlockTime((sumBlockTime / listAvgBlockTime.length).toFixed(1))
    } else {
      setAvgBlockTime('0')
    }
  }, [listAvgBlockTime])

  useEffect(() => {
    handleLastBlock()
  }, [])

  useEffect(() => {
    setBestBlock(getBestBlock()) //eslint-disable-next-line
  }, [data])

  return (
    <div className="network-status-content">
      <InformationPanel
        title={BEST_BLOCK}
        data={`#${bestBlock.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
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
  )
}

const Monitor: React.FC<{}> = () => {
  const nodes = useSelector(({ node }: { node: NodeState }) => node)
  const history = useHistory()
  const { protocol, handleSetFilterData, network } =
    useFilterStateWithHistory(history)
  const [sortDataList, setSortDataList] = useState<{
    desc: boolean
    sort: SORT_OPTION
  }>({ desc: false, sort: 'isItUp' })

  const { message, showMessage, setShowMessage } = useContext(MonitorContext)

  const selectedData = (): WSDoraData[] => {
    const sortedNodes = OrderNodes(
      sortDataList.sort,
      nodes.nodesArray,
      sortDataList.desc,
    )

    if (protocol === 'all' && network === 'all') {
      return sortedNodes
    } else if (protocol === 'all' && network !== 'all') {
      return sortedNodes.filter(node => node.network === network)
    } else if (protocol !== 'all' && network === 'all') {
      return sortedNodes.filter(node => node.protocol === protocol)
    } else {
      //temporary state, remove when api cuts over
      let mutableNetwork = network
      if (protocol === 'neo3' && mutableNetwork === 'testnet') {
        mutableNetwork = 'testnet_rc3'
      }
      if (mutableNetwork === 'testnet_rc4') {
        mutableNetwork = 'testnet'
      }

      return sortedNodes.filter(
        node => node.protocol === protocol && node.network === mutableNetwork,
      )
    }
  }

  const handleSortDataList = (option: SORT_OPTION): void => {
    setSortDataList({ sort: option, desc: !sortDataList.desc })
  }

  const dispatch = useDispatch()

  /**
   * Configures and begins listening to the socket
   */
  useEffect(() => {
    socket.listening<WSDoraData>(data => {
      dispatch(setNode(data))
    })
  }, [dispatch, sortDataList])

  const width = useWindowWidth()

  const conditionalColumns =
    width > 1000
      ? width < 1200
        ? tabletColumns
        : columns
      : width < 768
      ? mobileColumns
      : tabletColumns

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
          {ROUTES.MONITOR.renderIcon()}
          <h1>{ROUTES.MONITOR.name}</h1>
        </div>
        <div className="network-status-container">
          <div className="network-status-header">
            <span className="network-status-title">Network status</span>
            <div className="network-status-toggle">
              <Filter
                selectedOption={{
                  label: '',
                  value: {
                    protocol,
                    network,
                  },
                }}
                handleFilterUpdate={(option): void => {
                  handleSetFilterData({
                    protocol: (option.value as Platform).protocol,
                    network: (option.value as Platform).network,
                  })
                }}
              />
            </div>
          </div>
          <NetworkStatus data={selectedData()} />
        </div>
        <div>
          <List
            data={returnNodesListData(selectedData(), !selectedData().length)}
            columns={conditionalColumns}
            isLoading={nodes.isLoading}
            rowId="endpoint"
            leftBorderColorOnRow={(_, chain): string => {
              const color = STATUS_ICONS.find(
                ({ status }) => status === chain,
              )?.color
              return color ?? '#de4c85'
            }}
            orderData={true}
            callbalOrderData={handleSortDataList}
            paddingCell={{ paddingValue: '0 0 0 21px', indexesColumns: [0] }}
          />
        </div>
        <Snackbar
          title={message}
          open={showMessage}
          autoHideDuration={1000}
          onClose={(): void => {
            setShowMessage(false)
          }}
        >
          <div className="copy-clipboard">
            <span>{message}</span>
          </div>
        </Snackbar>
      </div>
    </div>
  )
}

export default Monitor
