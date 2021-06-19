import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router'
import { Observable } from 'rxjs'
import { Community } from '../../../../global/domain'
import { CommunityService } from '../../../../global/domain/services/community/community.service'

@Injectable()
export class SingleCommunityResolver implements Resolve<Community> {
  constructor(private communityService: CommunityService) {
  }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Community> {
    const nickname: string | null = route.paramMap.get('nickname')

    if (nickname === null) {
      throw new Error(`nickname not specified`)
    }

    return this.communityService.getByNickname(nickname)
  }
}
