import { CommunityType } from './community-type.enum'
import { SportType } from '../event'

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
