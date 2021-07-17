import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { filter } from 'rxjs/operators'
import { Community } from '../../../../global/domain'

@Injectable()
export class CommunityStoreService {

  private community: BehaviorSubject<Community | null> = new BehaviorSubject<Community | null>(null)

  /**
   * Поток изменений значения сообщества
   */
  public communityChanges: Observable<Community> = this.community.pipe(
    filter((community: Community | null): community is Community => community !== null)
  )

  /**
   * Задает значение сообщества
   *
   * @param community Сообщество
   */
  public setCommunity(community: Community): void {
    this.community.next(community)
  }

  /**
   * Возвращает сообщество или NULL
   */
  public takeCommunity(): Community | null {
    return this.community.value
  }

  /**
   * Возвращает сервис к изначальным данным
   */
  public reset(): void {
    this.community.next(null)
  }
}
