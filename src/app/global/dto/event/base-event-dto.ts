import { EventType } from '../../domain'
import { ISO8601 } from '../../models'

export interface BaseEventDto {
  id: null
  ownerUserId: number
  communityId: number | null
  eventType: EventType
  startDate: ISO8601
  routeId: number
  venueGeoData: string
  memberUserIds: number[]
  duration: number
  description: string
  url: string
  createdAd: null
}
