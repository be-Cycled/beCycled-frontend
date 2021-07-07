import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { tap } from 'rxjs/operators'
import { Community } from '../../../../global/domain'
import { CommunityService } from '../../../../global/domain/services/community/community.service'

@Injectable()
export class CommunityStoreService {

  private community: Community | null = null

  constructor(private communityService: CommunityService) {
  }

  public takeCommunity(nickname: string): Observable<Community> {
    if (this.community !== null && this.community.nickname === nickname) {
      return of(this.community)
    }

    return this.communityService.getByNickname(nickname).pipe(
      tap((community: Community) => this.community = community)
    )
  }
}
