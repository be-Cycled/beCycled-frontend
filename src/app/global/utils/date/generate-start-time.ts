import { ISO8601 } from '../../models'

export function generateStartTime(date: ISO8601): string {
  const parsedDate: Date = new Date(date)
  return parsedDate.toLocaleString('ru-RU', {
    hour: 'numeric',
    minute: 'numeric'
  })
}
