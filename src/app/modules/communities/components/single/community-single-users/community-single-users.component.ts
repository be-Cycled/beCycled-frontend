import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { BehaviorSubject, defer, Observable, of } from 'rxjs'
import { catchError, shareReplay, switchMap, take, tap } from 'rxjs/operators'
import { Community, User } from '../../../../../global/domain'
import { CommunityService } from '../../../../../global/domain/services/community/community.service'
import { CommunityStoreService } from '../../../services'

@Component({
  selector: 'cy-community-single-users',
  templateUrl: './community-single-users.component.html',
  styleUrls: ['./community-single-users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommunitySingleUsersComponent implements OnInit {

  public userShowLoader: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  public users: Observable<User[]> = defer(() => this.communityStoreService.communityChanges.pipe(
    switchMap((community: Community) => {
      this.userShowLoader.next(true)

      return this.communityService.getUsersByCommunity(community.nickname).pipe(
        tap(() => this.userShowLoader.next(false)),
        catchError(() => of([]))
      )
    }),
    shareReplay({ refCount: true, bufferSize: 1 })
  ))

  public community: Observable<Community> = this.communityStoreService.communityChanges.pipe()

  constructor(private communityStoreService: CommunityStoreService,
              private communityService: CommunityService) {
  }

  public ngOnInit(): void {
    this.users.pipe(take(1)).subscribe()
  }

}
