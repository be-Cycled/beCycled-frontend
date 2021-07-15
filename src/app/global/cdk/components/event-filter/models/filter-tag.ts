import { EventType, SportType } from '../../../../domain'

export interface FilterTag {
  title: string
  value: EventType | SportType
  count: number
}
