import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { Community, User } from '../../../../global/domain'
import { PATH_PARAMS } from '../../../../global/models'
import { UserHolderService } from '../../../../global/services'
import { CommunityStoreService } from '../../services'

@Injectable()
export class CommunitySettingsGuard implements CanActivate {
  constructor(private communityStoreService: CommunityStoreService,
              private userHolderService: UserHolderService) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    debugger
    const user: User | null = this.userHolderService.getUser()

    if (user === null) {
      return of(false)
    }

    const parentRoute: ActivatedRouteSnapshot | null = route.parent

    if (parentRoute === null) {
      return of(false)
    }

    const communityNickname: string | null = parentRoute.paramMap.get(PATH_PARAMS.communityNickname)

    if (communityNickname === null) {
      throw new Error(`That routes must have "nickname" param`)
    }

    return this.communityStoreService.takeCommunity(communityNickname).pipe(
      map((community: Community) => community.ownerUserId === user.id),
      catchError(() => of(false))
    )
  }
}
