import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { BehaviorSubject, Observable, of } from 'rxjs'
import { map, pluck, shareReplay, switchMap, tap } from 'rxjs/operators'
import { Community, SportType, User } from '../../../../../global/domain'
import { CommunityService } from '../../../../../global/domain/services/community/community.service'
import { CompetitionService } from '../../../../../global/domain/services/competition/competition.service'
import { WorkoutService } from '../../../../../global/domain/services/workout/workout.service'
import { SomeWrappedEvent } from '../../../../../global/models'
import { CommunityStoreService } from '../../../services'

@Component({
  selector: 'cy-community-single-main',
  templateUrl: './community-single-main.component.html',
  styleUrls: ['./community-single-main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommunitySingleMainComponent {

  public events: Observable<SomeWrappedEvent[]> = of([])

  public sportTypes: Observable<SportType[]> = this.communityStoreService.communityChanges.pipe(
    pluck('sportTypes')
  )

  public sportTypesMap: Record<SportType, string> = {
    [ SportType.bicycle ]: `Велосипед`,
    [ SportType.rollerblade ]: `Ролики`,
    [ SportType.run ]: `Бег`
  }

  public isUsersShowLoader: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  public users: Observable<User[]> = this.communityStoreService.communityChanges.pipe(
    switchMap((community: Community) => {
      this.isUsersShowLoader.next(true)

      return this.communityService.getUsersByCommunity(community.nickname).pipe(
        tap(() => this.isUsersShowLoader.next(false)),
        shareReplay({ bufferSize: 1, refCount: true })
      )
    })
  )

  public userCount: Observable<number> = this.users.pipe(
    map((users: User[]) => users.length)
  )

  public firstUsers: Observable<User[]> = this.users.pipe(
    map((users: User[]) => users.slice(0, 5))
  )

  constructor(private communityStoreService: CommunityStoreService,
              private communityService: CommunityService,
              private workoutService: WorkoutService,
              private competitionService: CompetitionService,
              public readonly activatedRoute: ActivatedRoute) {
  }
}
