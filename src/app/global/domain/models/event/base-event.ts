import { ISO8601 } from '../../../models'
import { EventType } from './enums'

export interface BaseEvent {
  /**
   * Уникальный идентификатор
   */
  id: number

  /**
   * Идентификатор пользователя, который создал событие
   */
  ownerUserId: number

  /**
   * Идентификатор сообщества, в рамках которого проводится событие
   */
  communityId: number | null

  /**
   * Тип события
   */
  eventType: EventType

  /**
   * Время начала события
   */
  startDate: ISO8601

  /**
   * Идентификатор маршрута, по которому будет проходить событие
   */
  routeId: number

  /**
   * Строковое представление JSON: { lng: number, lat: number }
   */
  venueGeoData: string

  /**
   * Список идентификаторов пользователей, участвующих в событии
   */
  memberUserIds: number[]

  /**
   * Длительность события, секунды
   */
  duration: number

  /**
   * Описание события
   */
  description: string

  /**
   * Время создания
   */
  createdAd: ISO8601
}
