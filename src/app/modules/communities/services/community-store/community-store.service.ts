import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { filter, shareReplay, take } from 'rxjs/operators'
import { Community } from '../../../../global/domain'
import { CommunityService } from '../../../../global/domain/services/community/community.service'

@Injectable()
export class CommunityStoreService {

  private community$: BehaviorSubject<Community | null> = new BehaviorSubject<Community | null>(null)

  /**
   * Поток изменений значения сообщества
   */
  public communityChanges$: Observable<Community> = this.community$.pipe(
    filter((community: Community | null): community is Community => community !== null)
  )

  /**
   * @todo Нужно вынести в отдельный сервис. И добавить апдейтер, чтобы при создании или обновлении сообщества
   * этот поток перезапрашивался
   */
  public allCommunities$: Observable<Community[]> = this.communityService.getAll().pipe(
    take(1),
    shareReplay(1)
  )

  constructor(private communityService: CommunityService) {
  }

  /**
   * Задает значение сообщества
   *
   * @param community Сообщество
   */
  public setCommunity(community: Community): void {
    this.community$.next(community)
  }

  /**
   * Возвращает сообщество или NULL
   */
  public takeCommunity(): Community | null {
    return this.community$.value
  }

  /**
   * Возвращает сервис к изначальным данным
   */
  public reset(): void {
    this.community$.next(null)
  }
}
