import React, {
  ReactElement,
  useEffect,
  useState,
  useContext,
  useMemo,
  ReactText,
} from 'react'
import { Link } from 'react-router-dom'
import ReactCountryFlag from 'react-country-flag'
import { useSelector, useDispatch } from 'react-redux'

import { Snackbar, Theme, Tooltip, withStyles } from '@material-ui/core'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import { Socket } from '../../config/Socket'
import './Monitor.scss'
import { ROUTES } from '../../constants'
import Breadcrumbs from '../../components/navigation/Breadcrumbs'
import { ReactComponent as ArrowSortSVG } from '../../assets/icons/arrow-sort.svg'
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
import { ColumnType } from '../../components/list/List'
import { MOCK_NODES } from '../../utils/mockData'
import InformationPanel from '../../components/panel/InformationPanel'
import { ReactComponent as ApprovedSVG } from '../../assets/icons/approved.svg'
import { ReactComponent as DisapprovedSVG } from '../../assets/icons/disapproved.svg'
import { ReactComponent as OnHoldSVG } from '../../assets/icons/on-hold.svg'
import { MonitorContext } from '../../contexts/MonitorContext'
import { ReactComponent as CopyIcon } from '../../assets/icons/content_copy_white_48dp.svg'
import useWindowWidth from '../../hooks/useWindowWidth'
import Filter, { Platform } from '../../components/filter/Filter'
import classNames from 'classnames'
import useFilterState from '../../hooks/useFilterState'
import { uniqueId } from 'lodash'

type ParsedNodes = {
  endpoint: React.FC<{}>
  isItUp: React.FC<{}>
  availability: string | React.FC<{}>
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
  endpointLocation: string
}

const STATUS_ICONS = [
  { status: 'ok', Icon: ApprovedSVG, color: '#4cffb3' },
  { status: 'stateheight stalled', Icon: OnHoldSVG, color: '#ffc24c' },
  { status: 'stateheight lagging', Icon: ApprovedSVG, color: '#4cffb3' },
  { status: 'stalled', Icon: DisapprovedSVG, color: '#de4c85' },
]

const Endpoint: React.FC<Endpoint> = ({ url, endpointLocation, disable }) => {
  const { setMessage, setShowMessage } = useContext(MonitorContext)
  const handleClickEndpoint = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ): void => {
    e.preventDefault()
    navigator.clipboard.writeText(url)
    setMessage('Copied to Clipboard!')
    setShowMessage(true)
  }

  const LOCATIONS_FLAGS = [
    { location: 'United States', countryCode: 'US' },
    { location: 'USA', countryCode: 'US' },
    { location: 'Hong Kong', countryCode: 'HK' },
    { location: 'Canada', countryCode: 'CA' },
    { location: 'China', countryCode: 'CN' },
    { location: 'US', countryCode: 'US' },
    { location: 'Singapore', countryCode: 'SG' },
    { location: 'France', countryCode: 'FR' },
    { location: 'Russia', countryCode: 'RU' },
  ]

  return (
    <div className={disable ? 'endpoint disable' : 'endpoint'}>
      <div className="endpoint-flag-container">
        <ReactCountryFlag
          svg
          style={{
            fontSize: '1.5em',
            lineHeight: '1.5em',
          }}
          countryCode={
            LOCATIONS_FLAGS.find(
              ({ location }) => location === endpointLocation,
            )?.countryCode
          }
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
  fromMonitor?: boolean
  url?: string
}

const IsItUpTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    border: '1px solid #4cffb3',
    backgroundColor: 'rgba(14, 25, 27, 0.73)',
    fontSize: '13px',
  },
  arrow: {
    color: 'rgba(14, 25, 27, 1)',
    '&::before': {
      border: '1px solid #4cffb3',
    },
  },
}))(Tooltip)

export const IsItUp: React.FC<IsItUp> = ({
  statusIsItUp,
  fromMonitor,
  url,
}): JSX.Element => {
  const width = useWindowWidth()
  const canNavigate = width < 1200 && fromMonitor
  const { setStopRender } = useContext(MonitorContext)
  const [showToolTip, setShowToolTip] = useState<boolean>(false)
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

  const handleMouseEvent = (showTooltip: boolean): void => {
    if (setStopRender) {
      setStopRender(showTooltip)
    }
    setShowToolTip(showTooltip)
  }

  const Icon = getIconByStatus()
  return (
    <div
      onMouseEnter={(): void => handleMouseEvent(true)}
      onMouseLeave={(): void => handleMouseEvent(false)}
    >
      <IsItUpTooltip
        open={showToolTip}
        arrow={true}
        title={`Status: ${statusIsItUp}`}
        onClose={(): void => {
          setStopRender && setStopRender(false)
        }}
        placement={'right'}
      >
        {canNavigate ? (
          <Link
            style={{ textDecoration: 'none' }}
            to={`${ROUTES.ENDPOINT.url}/${url}`}
            className={'link'}
          >
            {<Icon />}
          </Link>
        ) : (
          <div>{<Icon />}</div>
        )}
      </IsItUpTooltip>
    </div>
  )
}

interface NegativeComponent extends AllNodes {
  useHashTag?: boolean
  hasArrowAvailability?: boolean
  hasArrowPeers?: boolean
  url?: string
}

const NegativeComponent: React.FC<NegativeComponent> = ({
  useHashTag,
  disable,
  hasArrowAvailability,
  hasArrowPeers,
  url,
}) => {
  const width = useWindowWidth()
  let showArrow = false
  const canNavigate = width < 1200

  if (
    (hasArrowPeers && width < 1200) ||
    (hasArrowAvailability && width < 768)
  ) {
    showArrow = true
  }

  return canNavigate ? (
    useHashTag ? (
      <Link
        to={`${ROUTES.ENDPOINT.url}/${url}`}
        className={disable ? 'disableLink' : 'link'}
        style={{ textDecoration: 'none' }}
      >
        # -
      </Link>
    ) : showArrow ? (
      <Link
        to={`${ROUTES.ENDPOINT.url}/${url}`}
        className={'with-arrow'}
        style={{ textDecoration: 'none' }}
      >
        <div className={disable ? 'disable' : ''}>-</div>
        <ArrowForwardIcon style={{ color: '#d355e7' }} />
      </Link>
    ) : (
      <Link
        to={`${ROUTES.ENDPOINT.url}/${url}`}
        className={disable ? 'disableLink' : 'link'}
        style={{ textDecoration: 'none' }}
      >
        -
      </Link>
    )
  ) : useHashTag ? (
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

interface NavigateColumn extends AllNodes {
  text: string
  url?: string
}

const NavigateColumn: React.FC<NavigateColumn> = ({ text, disable, url }) => {
  const width = useWindowWidth()
  return width < 1200 ? (
    <Link
      to={`${ROUTES.ENDPOINT.url}/${url}`}
      className={disable ? 'disableLink' : 'link'}
      style={{ textDecoration: 'none' }}
    >
      {text}
    </Link>
  ) : (
    <div className={disable ? 'disable' : ''}>{text}</div>
  )
}

interface StateHeight extends AllNodes {
  text: string
}

const StateHeight: React.FC<StateHeight> = ({ text, disable }) => {
  return <div className={disable ? 'disable' : ''}>{text}</div>
}

interface Peers extends AllNodes {
  text: number
  url?: string
}

const Peers: React.FC<Peers> = ({ text, disable, url }) => {
  const width = useWindowWidth()
  return width < 768 ? (
    <Link
      to={`${ROUTES.ENDPOINT.url}/${url}`}
      style={{ textDecoration: 'none' }}
      className={'link'}
    >
      <div className={disable ? 'disable' : ''}>{text}</div>
    </Link>
  ) : width < 1200 ? (
    <Link
      to={`${ROUTES.ENDPOINT.url}/${url}`}
      className={'with-arrow'}
      style={{ textDecoration: 'none' }}
    >
      <div className={disable ? 'disable' : ''}>{text}</div>
      <ArrowForwardIcon style={{ color: '#d355e7' }} />
    </Link>
  ) : (
    <div className={disable ? 'disable' : ''}>{text}</div>
  )
}

interface Availability extends AllNodes {
  text: string
  url?: string
}

const Availability: React.FC<Availability> = ({ text, disable, url }) => {
  const width = useWindowWidth()
  return width < 768 ? (
    <Link
      to={`${ROUTES.ENDPOINT.url}/${url}`}
      className={'with-arrow'}
      style={{ textDecoration: 'none' }}
    >
      <div className={disable ? 'disable' : ''}>{text}</div>
      <ArrowForwardIcon style={{ color: '#d355e7' }} />
    </Link>
  ) : width < 1200 ? (
    <Link
      to={`${ROUTES.ENDPOINT.url}/${url}`}
      style={{ textDecoration: 'none' }}
      className={'link'}
    >
      <div className={disable ? 'disable' : ''}>{text}</div>
    </Link>
  ) : (
    <div className={disable ? 'disable' : ''}>{text}</div>
  )
}

const mapNodesData = (data: WSDoraData): ParsedNodes => {
  const url = data.url
    .replace('http://', '+')
    .replace('https://', '&')
    .replace(/\./g, '_')
    .replace(/:/g, '-')
  const isPositive = (): boolean =>
    data.status === 'ok' ||
    data.status === 'stateheight stalled' ||
    data.status === 'stateheight lagging'

  return {
    endpoint: (): ReactElement => (
      <Endpoint
        url={data.url}
        endpointLocation={data.location}
        disable={!isPositive()}
        key={data.url}
      />
    ),
    blockHeight: isPositive()
      ? (): ReactElement => (
          <NavigateColumn text={`#${data.height}`} url={url} />
        )
      : (): ReactElement => (
          <NegativeComponent
            useHashTag={true}
            disable={!isPositive()}
            url={url}
          />
        ),
    version: isPositive()
      ? (): ReactElement => <NavigateColumn text={data.user_agent} url={url} />
      : (): ReactElement => (
          <NegativeComponent disable={!isPositive()} url={url} />
        ),
    peers: isPositive()
      ? (): ReactElement => <Peers text={data.peers} url={url} />
      : (): ReactElement => (
          <NegativeComponent
            disable={!isPositive()}
            hasArrowPeers={true}
            url={url}
          />
        ),
    availability: isPositive()
      ? (): ReactElement => (
          <Availability text={`${data.availability.toFixed(2)}%`} url={url} />
        )
      : (): ReactElement => (
          <NegativeComponent
            disable={!isPositive()}
            hasArrowAvailability={true}
            url={url}
          />
        ),
    isItUp: (): ReactElement => (
      <IsItUp
        statusIsItUp={data.status}
        fromMonitor={true}
        url={url}
        key={`${data.url} isitup`}
      />
    ),
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
  { name: 'Is it up?', accessor: 'isItUp', sortOpt: 'isItUp' },
  { name: 'Availability', accessor: 'availability', sortOpt: 'availability' },
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

interface ListMonitor {
  network: string
  protocol: string
}

const ListMonitor: React.FC<ListMonitor> = ({ network, protocol }) => {
  const nodes = useSelector(({ node }: { node: NodeState }) => node)
  const { stopRender } = useContext(MonitorContext)
  const [data, setData] = useState<Array<ParsedNodes>>([])
  const dispatch = useDispatch()

  const isLoading = nodes.isLoading
  const [sortDataList, setSortDataList] = useState<{
    desc: boolean
    sort: SORT_OPTION
  }>({ desc: false, sort: 'isItUp' })

  const selectedData = (): WSDoraData[] => {
    const sortedNodes = OrderNodes(
      sortDataList.sort,
      nodes.nodesArray,
      sortDataList.desc,
    )

    if (protocol === 'all' && network === 'all') {
      return sortedNodes
    } else if (network !== 'all') {
      return sortedNodes.filter(node => node.network === network)
    } else {
      //temporary state, remove when api cuts over
      let mutableNetwork = network
      if (mutableNetwork === 'testnet_rc4') {
        mutableNetwork = 'testnet'
      }

      return sortedNodes.filter(node => node.network === mutableNetwork)
    }
  }

  const leftBorderColorOnRow = (
    _: string | number | React.FC<{}> | undefined,
    chain: string | number | React.FC<{}> | undefined,
  ): string => {
    const color = STATUS_ICONS.find(({ status }) => status === chain)?.color
    return color ?? '#de4c85'
  }

  const handleSortDataList = (option: SORT_OPTION): void => {
    setSortDataList({ sort: option, desc: !sortDataList.desc })
  }

  const width = useWindowWidth()

  /**
   * Configures and begins listening to the socket
   */
  useEffect(() => {
    let socket: Socket
    if (window.location.pathname.includes(ROUTES.MONITOR.url)) {
      socket = new Socket('wss://dora.coz.io/ws/v2/unified/network_status')
      socket.listening<WSDoraData>(data => {
        dispatch(setNode(data))
      })
    }

    return () => {
      socket.close()
    }
  }, [dispatch, sortDataList, stopRender])

  const headerRowClass = classNames({
    'loading-table-row': isLoading,
    'data-list-column': true,
  })

  useEffect(() => {
    if (!stopRender) {
      setData(returnNodesListData(selectedData(), !selectedData().length))
    } //eslint-disable-next-line
  }, [nodes, sortDataList])

  useEffect(() => {
    setData(returnNodesListData(selectedData(), !selectedData().length)) //eslint-disable-next-line
  }, [network, protocol])

  const rowClass = classNames({
    'loading-table-row': isLoading,
    'without-pointer-cursor': true,
  })

  const conditionalBorderRadius = (
    index: number,
    shouldReturnBorderLeftStyle?: boolean,
    id?: string | number | React.FC<{}>,
    chain?: string | number | React.FC<{}>,
  ): { borderRadius: string } | undefined => {
    if (!index) {
      const border = {
        borderRadius: '3px 0 0 3px',
        borderLeft: '',
      }
      if (shouldReturnBorderLeftStyle && leftBorderColorOnRow) {
        border.borderLeft = `solid 3px ${
          typeof leftBorderColorOnRow === 'function'
            ? leftBorderColorOnRow(id, chain)
            : leftBorderColorOnRow
        }`
      }
      return border
    }
    if (index === columns.length) {
      const border = {
        borderRadius: '0 3px 3px 0',
      }
      return border
    }
    return undefined
  }

  const CListMonitor = useMemo(() => {
    const renderCellData = (
      isLoading: boolean,
      data: string | number | React.FC<{}>,
    ): ReactText | React.ReactNode => {
      const cellProps = {}
      if (isLoading) return undefined
      if (typeof data === 'function') return data(cellProps)
      return data
    }

    const conditionalColumns =
      width > 1000
        ? width < 1200
          ? tabletColumns
          : columns
        : width < 768
        ? mobileColumns
        : tabletColumns

    const gridstyle = {
      gridTemplateColumns: `repeat(${conditionalColumns.length}, auto)`,
    }

    const sortedByAccessor = data.map(
      (
        data: {
          [key: string]: string | number | React.FC<{}>
        },
        index: number,
      ) => {
        interface Sorted {
          id: string

          [key: string]: string | number | React.FC<{}>
        }

        const sorted = {} as Sorted
        conditionalColumns.forEach(column => {
          sorted[column.accessor] = data[column.accessor]
          sorted.id = String(data['endpoint'])
          sorted.chain = data.chain
        })
        return sorted
      },
    )

    interface HeaderCell {
      styleHeader?: React.CSSProperties
      classNameHeader?: string
      nameColumn?: React.Key | null
      isLoading?: boolean
      orderData?: boolean
      sortOpt?: SORT_OPTION
      callbalOrderData?: (field: SORT_OPTION) => void
    }

    const HeaderCell: React.FC<HeaderCell> = ({
      styleHeader,
      classNameHeader,
      nameColumn,
      isLoading,
      sortOpt,
      callbalOrderData,
    }) => {
      return (
        <div
          style={styleHeader}
          className={`${classNameHeader} header-cell-container`}
          key={nameColumn}
          onClick={(e): void => {
            e.preventDefault()
            callbalOrderData && sortOpt && callbalOrderData(sortOpt)
          }}
        >
          {isLoading ? '' : nameColumn}
          <div className="data-list-arrow-sort">
            <ArrowSortSVG />
          </div>
        </div>
      )
    }

    return (
      <div className="data-list" style={gridstyle}>
        {conditionalColumns.map((column, i) => {
          return (
            <HeaderCell
              classNameHeader={headerRowClass}
              styleHeader={{
                ...conditionalBorderRadius(i),
                ...(column.style || {}),
              }}
              key={column.name}
              isLoading={nodes.isLoading}
              sortOpt={column.sortOpt}
              callbalOrderData={handleSortDataList}
              nameColumn={column.name}
            />
          )
        })}
        {sortedByAccessor.map(
          (
            data: {
              [key: string]: string | number | React.FC<{}>
            },
            index: number,
          ) =>
            Object.keys(data).map((key, i) => {
              return (
                key !== 'id' &&
                key !== 'href' &&
                key !== 'chain' && (
                  <div
                    id="non-link-list-cell-container"
                    style={conditionalBorderRadius(
                      i,
                      true,
                      data.id,
                      data.chain,
                    )}
                    key={uniqueId()}
                    className={rowClass}
                  >
                    {renderCellData(isLoading, data[key])}
                  </div>
                )
              )
            }),
        )}
      </div>
    ) //eslint-disable-next-line
  }, [data, width])

  return CListMonitor
}

const Monitor: React.FC<{}> = () => {
  const nodes = useSelector(({ node }: { node: NodeState }) => node)
  const { protocol, handleSetFilterData, network } = useFilterState()
  const [sortDataList] = useState<{
    desc: boolean
    sort: SORT_OPTION
  }>({ desc: false, sort: 'isItUp' })

  const { message, showMessage, setShowMessage, setNetwork, setProtocol } =
    useContext(MonitorContext)

  const selectedData = (): WSDoraData[] => {
    let sortedNodes = OrderNodes(
      sortDataList.sort,
      nodes.nodesArray,
      sortDataList.desc,
    )

    if (network !== 'all') {
      sortedNodes = sortedNodes.filter(node => node.network === network)
    }

    return sortedNodes
  }

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
                  setNetwork((option.value as Platform).network)
                  setProtocol((option.value as Platform).protocol)
                }}
              />
            </div>
          </div>
          <NetworkStatus data={selectedData()} />
        </div>
        <div>
          <ListMonitor network={network} protocol={protocol} />
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
