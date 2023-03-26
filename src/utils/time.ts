import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export function fromNow (date2Format: string): string {
  return dayjs(date2Format).fromNow()
}

export function isAfter (a, b): boolean {
  return dayjs(a).isAfter(dayjs(b))
}

export function formatTime (date2Format: string): string {
  return dayjs(date2Format).format('YYYY-MM-DD')
}
