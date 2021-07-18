import { EventType, SportType } from '../../domain'
import { ISO8601 } from '../../models'

export interface BaseEventDto {
  id: null
  ownerUserId: number
  communityId: number | null
  eventType: EventType
  isPrivate: boolean
  startDate: ISO8601
  routeId: number
  sportType: SportType
  venueGeoData: string
  memberUserIds: number[]
  duration: number
  description: string
  createdAd: null
}
