import { EventType, SportType } from '../domain'
import { ISO8601 } from '../models'

/**
 * @see Competition
 */
export interface CompetitionDto {
  id: null
  ownerUserId: number
  communityId: number | null
  eventType: EventType
  isPrivate: boolean
  startDate: ISO8601
  routeId: number
  sportType: SportType
  venueGeoData: string
  userIds: number[]
  duration: number
  description: string
  createdAd: null
}
