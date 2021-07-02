import { Injectable } from '@angular/core'
import { EMPTY, Observable } from 'rxjs'
import { catchError, switchMap, tap } from 'rxjs/operators'
import { Community } from '../../../../global/domain'
import { CommunityService } from '../../../../global/domain/services/community/community.service'
import { ComponentStore, StateDispatcher } from '../../../../global/services'

export interface CommunityState {
  community: Community | null
  communityShowLoader: boolean
}

@Injectable({ providedIn: 'root' })
export class CommunityStore extends ComponentStore<CommunityState> {
  constructor(private communityService: CommunityService) {
    super({
      community: null,
      communityShowLoader: false
    })
  }

  public setCommunityShowLoader: StateDispatcher<boolean> = this.createUpdater((state: CommunityState, value: boolean) => {
    return {
      ...state,
      communityShowLoader: value
    }
  })

  public getCommunity: StateDispatcher<string> = this.createEffect((nicknameChanges: Observable<string>) => {
    this.setCommunityShowLoader(true)

    return nicknameChanges.pipe(
      switchMap((nickname: string) => this.communityService.getByNickname(nickname).pipe(
        tap((community: Community) => this.patchState({ community })),
        catchError(() => EMPTY),
        tap(() => this.setCommunityShowLoader(false))
      ))
    )
  })
}
