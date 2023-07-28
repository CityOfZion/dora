import moment from 'moment'

import { Block } from '../reducers/blockReducer'
import { Contract } from '../reducers/contractReducer'
import { Transaction } from '../reducers/transactionReducer'

export const convertMilliseconds = (ms: number): string => {
  return `${new Date(ms).getUTCSeconds()} seconds`
}

export const formatTime = (time: string): string =>
  moment(time).format('MM-DD-YYYY | hh:mm:ss')

export const convertMillisecondsToSeconds = (millis: number): number =>
  Math.floor(millis / 1000)

export const getDiffInSecondsFromNow = (then: string): number => {
  const now = new Date()
  const thenMoment = moment(then)
  const seconds = moment(now).diff(thenMoment, 'seconds')
  return seconds
}

export const convertFromSecondsToLarger = (timeInSeconds: number): string => {
  const convertedIncrements = {
    months: Math.floor((timeInSeconds % 3600) / 60),
    days: Math.floor(timeInSeconds / (3600 * 24)),
    hours: Math.floor((timeInSeconds % (3600 * 24)) / 3600),
    seconds: Math.floor(timeInSeconds % 60),
  }

  const { days, months, hours, seconds } = convertedIncrements

  const dDisplay = days > 0 ? days + (days === 1 ? ' day ' : ' days ') : ''

  const hDisplay = hours > 0 ? hours + (hours === 1 ? ' hour ' : ' hours ') : ''

  const mDisplay =
    months > 0 ? months + (months === 1 ? ' minute ' : ' minutes ') : ''

  const sDisplay =
    seconds > 0 ? seconds + (seconds === 1 ? ' second' : ' seconds') : ''

  if (dDisplay) {
    return dDisplay + ' ago'
  }

  if (hDisplay) {
    return hDisplay + ' ago'
  }

  if (mDisplay) {
    return mDisplay + ' ago'
  }

  return sDisplay + ' ago'
}

export const formatSecondsAgo = (time: string | number): string =>
  `${getDiffInSecondsFromNow(
    moment.unix(Number(time)).format(),
  ).toLocaleString()} seconds ago`

export const formatDate = (time: string | number): string =>
  moment.unix(Number(time)).format('MM-DD-YYYY')

export const format24Hours = (time: string | number): string =>
  moment.unix(Number(time)).format('HH:mm:ss')

type ListUnionType = (Block | Transaction | Contract)[]

export const sortedByDate = (
  neo2List: ListUnionType,
  neo3List: ListUnionType,
): ListUnionType => {
  const combinedList = [
    ...neo2List.map((t: Block | Transaction | Contract) => {
      t.protocol = 'neo2'
      return t
    }),
    ...neo3List.map((t: Block | Transaction | Contract) => {
      t.protocol = 'neo3'
      return t
    }),
  ]
  return combinedList.sort(
    (b: Block | Transaction | Contract, a: Block | Transaction | Contract) => {
      const formattedTime = (time: string | number): string =>
        moment(new Date(Number(time) * 1000)).format()

      return formattedTime(a.time).localeCompare(formattedTime(b.time))
    },
  )
}

export const sortSingleListByDate = (list: ListUnionType): ListUnionType => {
  return list.sort(
    (b: Block | Transaction | Contract, a: Block | Transaction | Contract) => {
      const formattedTime = (time: string | number): string =>
        moment(new Date(Number(time) * 1000)).format()

      return formattedTime(a.time).localeCompare(formattedTime(b.time))
    },
  )
}
