import moment from 'moment'

import { Block } from '../reducers/blockReducer'
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

export const formatSecondsAgo = (time: string | number): string => {
  return typeof time === 'number'
    ? `${getDiffInSecondsFromNow(
        moment.unix(time).format(),
      ).toLocaleString()} seconds ago`
    : `${getDiffInSecondsFromNow(
        moment.utc(time).local().format(),
      ).toLocaleString()} seconds ago`
}

type ListUnionType = (Block | Transaction)[]

export const sortedByDate = (
  neo2List: ListUnionType,
  neo3List: ListUnionType,
): ListUnionType => {
  const combinedList = [
    ...neo2List.map((t: Block | Transaction) => {
      t.chain = 'neo2'

      return t
    }),
    ...neo3List.map((t: Block | Transaction) => {
      t.chain = 'neo3'
      return t
    }),
  ]
  return combinedList.sort((b: Block | Transaction, a: Block | Transaction) => {
    const formattedTime = (time: string | number): string =>
      typeof time === 'string'
        ? moment.utc(time).local().format()
        : moment(new Date(time * 1000)).format()

    return formattedTime(a.time).localeCompare(formattedTime(b.time))
  })
}
