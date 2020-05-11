import moment from 'moment'

export const convertMilliseconds = (ms: number): string => {
  return `${new Date(ms).getUTCSeconds()} seconds`
}

export const formatTime = (time: string): string =>
  moment(time).format('MM-DD-YYYY | HH:mm:ss')

export const convertMillisecondsToSeconds = (millis: number): number =>
  Math.floor(millis / 1000)

export const getDiffInSecondsFromNow = (then: string): number => {
  const now = new Date()

  const thenMoment = moment(then)

  const seconds = moment(now).diff(thenMoment, 'seconds')
  return seconds
}
