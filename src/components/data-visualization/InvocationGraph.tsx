import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { VictoryChart, VictoryAxis, VictoryLabel, VictoryArea } from 'victory'

import { ReactComponent as Warning } from '../../assets/icons/warning.svg'
import { InvocationStat } from '../../reducers/contractReducer'
import './InvocationGraph.scss'
import { isEmpty } from 'lodash'

type Props = {
  data: InvocationStat
}

type ParsedInvocationStat = {
  x: string
  y: number
}

type ParsedInvocationStats = ParsedInvocationStat[]

const theme = {
  axis: {
    style: {
      axis: {
        fill: 'transparent',
        stroke: 'transparent',
      },
      tickLabels: {
        fill: 'white',
        fontSize: 18,
        padding: 4,
      },
    },
  },
  parent: { border: '1px solid #4E5F62' },
}

const InvocationGraph: React.FC<Props> = ({ data }) => {
  const [width, setWidth] = useState(window.innerWidth)
  const [invocationsMade, setNoInvocationsMade] = useState(true)
  //eslint-disable-next-line
  // @ts-ignore
  const updateWidth = (ev): void => {
    setWidth(ev.target.innerWidth)
  }

  useEffect(() => {
    window.addEventListener('resize', updateWidth)
    if (isEmpty(data)) {
      setNoInvocationsMade(false)
    }
    return (): void => {
      window.removeEventListener('resize', updateWidth)
    }
  }, [data])

  const returnFormatedGraphData = (
    data: InvocationStat,
  ): ParsedInvocationStats => {
    const thirtyDayPlaceholder = [...Array(30)]

    const mappedStats = Object.keys(data).map(key => ({
      x: moment(key).format('MM/DD/YY'),
      y: data[key],
    }))
    return thirtyDayPlaceholder.map((day, i) => {
      const now = moment(Date.now()).add(1, 'days')
      const formattedDay = now.add(i - 30, 'days').format('MM/DD/YY')
      return (
        mappedStats.find(stat => stat.x === formattedDay) || {
          x: formattedDay,
          y: 0,
        }
      )
    })
  }

  const parsedData = returnFormatedGraphData(data)

  return (
    <div id="InvocationGraph">
      {!invocationsMade && (
        <div id="no-invocations-label">
          <Warning />
          NO INVOCATIONS MADE
        </div>
      )}
      <svg
        style={{ height: 0 }}
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
      >
        <defs>
          <linearGradient
            spreadMethod="pad"
            id="gradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="rgb(211, 85, 231)" />
            <stop offset="100%" stopColor="rgb(26, 47, 52)" />
          </linearGradient>
        </defs>
        <rect width="300" height="300" y="0" x="0" fill="url(#gradient)" />
      </svg>
      <svg
        // eslint-disable-next-line
        viewBox={'0 0' + ' ' + width + ' ' + '400'}
        preserveAspectRatio="none"
        width="100%"
      >
        <VictoryChart
          theme={theme}
          height={400}
          width={width}
          padding={{ left: 90, top: 50, right: 10, bottom: 50 }}
          standalone={false}
        >
          <VictoryArea
            style={{
              data: {
                stroke: 'rgb(211, 85, 231)',
                fill: 'url(#gradient)',
              },
            }}
            data={parsedData}
          />
          <VictoryAxis
            fixLabelOverlap
            offsetY={35}
            axisLabelComponent={<VictoryLabel />}
            style={{
              axisLabel: {
                padding: 12,
              },
              grid: { stroke: 'transparent' },
              tickLabels: {
                padding: 12,
              },
            }}
          />

          {!!Math.max.apply(
            Math,
            parsedData.map(function (o) {
              return o.y
            }),
          ) && (
            <VictoryAxis
              offsetX={70}
              dependentAxis
              axisLabelComponent={<VictoryLabel />}
              style={{
                grid: { stroke: '#4E5F62' },
              }}
            />
          )}
        </VictoryChart>
      </svg>
    </div>
  )
}

export default InvocationGraph
