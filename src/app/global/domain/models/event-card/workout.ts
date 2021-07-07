import { ISO8601 } from '../../../models'
import { SportType } from './enums'

export interface Workout {
  id: number
  userId: number
  communityId: number
  private: boolean
  startDate: ISO8601
  routeId: number
  sportType: SportType

  /**
   * Строковое представление JSON: { lng: number, lat: number }
   */
  venue: string
  userIds: number[]
  duration: number
  description: string
  createdAd: ISO8601
}
