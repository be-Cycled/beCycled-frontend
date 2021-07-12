import { ISO8601 } from '../../../models'
import { SportType } from './enums'

export interface Workout {
  id: number | null
  userId: number
  communityId: number | null
  private: boolean
  startDate: ISO8601
  routeId: number
  sportType: SportType

  /**
   * Строковое представление JSON: { lng: number, lat: number }
   */
  venueGeoData: string
  userIds: number[]
  duration: number
  description: string
  createdAd: ISO8601
}

export interface WorkoutDto {
  id: null
  userId: number
  communityId: number | null
  private: boolean
  startDate: ISO8601
  routeId: number
  sportType: SportType

  /**
   * Строковое представление JSON: { lng: number, lat: number }
   */
  venueGeoData: string
  userIds: number[]
  duration: number
  description: string
  createdAd: null
}
