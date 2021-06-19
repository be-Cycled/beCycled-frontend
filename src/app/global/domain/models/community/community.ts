import { SportType } from '../event-card'
import { CommunityType } from './community-type.enum'

export interface Community {
  id: number
  name: string
  nickname: string
  avatar: string
  ownerUserId: number
  userIds: number[]
  sportTypes: SportType[]
  url: string
  description: string
  createdAt: string
  communityType: CommunityType
}
