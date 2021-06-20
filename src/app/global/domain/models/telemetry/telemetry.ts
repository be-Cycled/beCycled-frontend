import { ISO8601 } from '../../../models'

export interface Telemetry {
  trackerId: string
  fixTime: ISO8601
  serverTime: ISO8601
  latitude: number
  longitude: number
  altitude: number
  speed: number
  course: number
}
