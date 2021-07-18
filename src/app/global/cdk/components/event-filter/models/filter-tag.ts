import { BaseEventType, SportType } from '../../../../domain'

export interface FilterTag {
  title: string
  value: SportType | BaseEventType
  count: number
}
