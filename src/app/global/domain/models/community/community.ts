import { SportType } from '../event'
import { CommunityType } from './community-type'

export interface Community {
  /**
   * Идентификатор сообщества
   */
  id: number

  /**
   * Название
   */
  name: string

  /**
   * Никнейм
   */
  nickname: string

  /**
   * Ссылка на аватарку
   */
  avatar: string

  /**
   * Идентификатор владельца сообщества
   */
  ownerUserId: number

  /**
   * Список идентификаторов участников
   */
  userIds: number[]

  /**
   * Список видов катания
   */
  sportTypes: SportType[]

  /**
   * Ссылка на сайт
   */
  url: string | null

  /**
   * Краткое описание
   */
  description: string | null

  /**
   * Время создания
   */
  createdAt: string | null

  /**
   * Тип сообщества
   */
  communityType: CommunityType
}
