import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Observable, of } from 'rxjs'
import { catchError, map, pluck, shareReplay, switchMap } from 'rxjs/operators'
import { BaseEvent, Community, SportType, User, UserService } from '../../../../../global/domain'
import { EventService } from '../../../../../global/domain/services/event/event.service'
import { CommunityStoreService } from '../../../services'

@Component({
  selector: 'cy-community-single-main',
  templateUrl: './community-single-main.component.html',
  styleUrls: ['./community-single-main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommunitySingleMainComponent {

  public events: Observable<BaseEvent[]> = this.communityStoreService.communityChanges$.pipe(
    switchMap((community: Community) => this.eventService.readEventByCommunity(community.nickname).pipe(
      catchError(() => of([]))
    ))
  )

  public sportTypes: Observable<SportType[]> = this.communityStoreService.communityChanges$.pipe(
    pluck('sportTypes')
  )

  public sportTypesMap: Record<SportType, string> = {
    [ SportType.bicycle ]: `Велосипед`,
    [ SportType.rollerblade ]: `Ролики`,
    [ SportType.run ]: `Бег`
  }

  public users: Observable<User[]> = this.communityStoreService.communityChanges$.pipe(
    switchMap((community: Community) =>
      this.userService.readUsersByCommunity(community.nickname).pipe(
        catchError(() => of([])),
        shareReplay({ bufferSize: 1, refCount: true })
      ))
  )

  public userCount: Observable<number> = this.users.pipe(
    map((users: User[]) => users.length)
  )

  public firstUsers: Observable<User[]> = this.users.pipe(
    map((users: User[]) => users.slice(0, 5))
  )

  constructor(private communityStoreService: CommunityStoreService,
              public readonly activatedRoute: ActivatedRoute,
              private eventService: EventService,
              private userService: UserService) {
  }
}
