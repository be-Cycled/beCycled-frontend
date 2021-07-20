import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'
import { catchError, map, switchMap, tap } from 'rxjs/operators'
import { Community, User } from '../../../../global/domain'
import { CommunityService } from '../../../../global/domain/services/community/community.service'
import { PATH_PARAMS } from '../../../../global/models'
import { UserStoreService } from '../../../../global/services'
import { CommunityStoreService } from '../../services'

@Injectable()
export class CommunitySettingsGuard implements CanActivate {
  constructor(private communityStoreService: CommunityStoreService,
              private communityService: CommunityService,
              private userStoreService: UserStoreService) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.userStoreService.userChanges.pipe(
      switchMap((user: User | null) => {
        if (user === null) {
          return of(false)
        }

        const community: Community | null = this.communityStoreService.takeCommunity()

        if (community === null) {
          const parentRoute: ActivatedRouteSnapshot | null = route.parent

          if (parentRoute === null) {
            throw new Error(`Misuse of the guard: Parent route does not exist`)
          }

          const communityNickname: string | null = parentRoute.paramMap.get(PATH_PARAMS.communityNickname)

          if (typeof communityNickname !== 'string') {
            return of(false)
          }

          return this.communityService.getByNickname(communityNickname).pipe(
            tap((community: Community) => this.communityStoreService.setCommunity(community)),
            map((community: Community) => community.ownerUserId === user.id),
            catchError(() => of(false))
          )
        }

        return this.communityStoreService.communityChanges$.pipe(
          map((community: Community) => community.ownerUserId === user.id)
        )
      })
    )
  }
}
