import { SportType } from '../event'
import { Community } from './community'
import { CommunityType } from './community-type'

/**
 * DTO сущности сообщества при ее создании
 * @see Community
 */
export interface CommunityCreateDto {
  /**
   * Идентификатор сообщества
   */
  id: null

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
  avatar: string | null

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
